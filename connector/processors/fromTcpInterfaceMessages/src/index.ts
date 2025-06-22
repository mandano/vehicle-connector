import path from "node:path";

import dotenv from "dotenv";
import UpdateConnectionState from "common/src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionState.ts";
import UpdateConnectionModules from "common/src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModules.ts";
import UpdateConnectionModule from "common/src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import CloneConnectionModule from "common/src/vehicle/components/iot/network/CloneConnectionModule.ts";
import CloneState from "common/src/vehicle/model/CloneState.ts";
import CloneConnectionState from "common/src/vehicle/components/iot/network/CloneConnectionState.ts";
import ConnectionState from "common/src/vehicle/components/iot/network/ConnectionState.ts";
import DtoContext from "common/src/vehicle/dto/_Context.ts";
import VehicleValkeyRepository from "common/src/repositories/vehicle/valkey/VehicleValkeyRepository.ts";
import ValkeyAdapter from "common/src/adapters/valkey/ValkeyAdapter.ts";

import { WorkerQueue } from "../../../common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { Exchange } from "../../../common/src/adapters/queue/rabbitMq/Exchange.ts";
import { SendActionRequest } from "../../../common/src/vehicle/model/actions/SendActionRequest.ts";
import { FileSystemAdapter } from "../../../common/src/adapters/FileSystemAdapter.ts";
import { Logger } from "../../../common/src/logger/Logger.ts";
import { LogLevels } from "../../../common/src/logger/LogLevels.ts";
import { Acknowledge } from "../../../common/src/vehicle/components/iot/network/protocol/Acknowledge.ts";
import { ImeiSocketIdFileRepository } from "../../../common/src/repositories/ImeiSocketIdFileRepository.ts";
import { Channel } from "../../../common/src/adapters/queue/rabbitMq/Channel.ts";
import { TcpInterfaceMessageJsonConverter } from "../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverter.ts";
import { Update } from "../../../common/src/vehicle/model/builders/update/Update.ts";
import { UpdateUnknown } from "../../../common/src/vehicle/model/builders/update/models/UpdateUnknown.ts";
import { UpdateEnergy } from "../../../common/src/vehicle/model/builders/update/components/UpdateEnergy.ts";
import { UpdateState } from "../../../common/src/vehicle/model/builders/update/components/UpdateState.ts";
import { UpdateIoT } from "../../../common/src/vehicle/model/builders/update/components/UpdateIoT.ts";
import { UpdateNetwork } from "../../../common/src/vehicle/model/builders/update/components/UpdateNetwork.ts";
import { UpdatePosition } from "../../../common/src/vehicle/model/builders/update/components/UpdatePosition.ts";
import { UpdateLockableScooter } from "../../../common/src/vehicle/model/builders/update/models/UpdateLockableScooter.ts";
import { UpdateLockState } from "../../../common/src/vehicle/model/builders/update/components/UpdateLockState.ts";
import { UpdateSpeedometer } from "../../../common/src/vehicle/model/builders/update/components/speedometer/UpdateSpeedometer.ts";
import PathResolver from "../../../common/src/adapters/fileSystem/PathResolver.ts";

import { Cleanup } from "./Cleanup.ts";
import { HandleFirstPaket } from "./handler/onData/HandleFirstPaket.ts";
import { HandleNotFirstPaket } from "./handler/onData/HandleNotFirstPaket.ts";
import { SaveVehicle } from "./handler/onData/SaveVehicle.ts";
import { OnDisconnection } from "./handler/OnDisconnection.ts";
import { ForwardToActionResponses } from "./handler/onData/ForwardToActionResponses.ts";
import { OnData } from "./handler/onData/OnData.ts";
import { ProcessFromTcpInterfaceMessage } from "./ProcessFromTcpInterfaceMessage.ts";
import { UpdateVehicle } from "./handler/onData/UpdateVehicle.ts";
import loadContext from "./bootstrap/loadContext.ts";

async function run() {
  dotenv.config();

  const logger = new Logger(LogLevels.DEBUG_LEVEL);

  const context = await loadContext();

  const pathResolver = new PathResolver();
  const filesPathShared = pathResolver.run(
    process.env.FILES_PATH_SHARED || "tmp",
  );

  const rabbitMqChannel = new Channel(context.rabbitMq, logger);

  const dtoContext = new DtoContext(
    new SendActionRequest(new WorkerQueue(rabbitMqChannel, "action_requests")),
  );

  const vehicleRepository = new VehicleValkeyRepository(
    new ValkeyAdapter(logger, {
      host: process.env.VALKEY_HOST ?? "localhost",
      port:  process.env.VALKEY_PORT ? parseInt(process.env.VALKEY_PORT) : 6379,
    }),
    logger,
    dtoContext.objectToDto().objectToDto(),
    dtoContext.dtoToVehicle().dtoToVehicle(),
    dtoContext.vehicleToObject(),
    dtoContext.dtoToObject(),
  );

  const fileSystemAdapter = new FileSystemAdapter(logger);

  const fromTcpInterface = new WorkerQueue(rabbitMqChannel, "fromTcpInterface");

  const exchange = new Exchange(rabbitMqChannel, "toTcpInterface", logger);

  const acknowledge = new Acknowledge(
    exchange,
    new TcpInterfaceMessageJsonConverter(logger),
    logger,
  );
  const handleLockAttribute = new ForwardToActionResponses(
    new Exchange(rabbitMqChannel, "action_responses", logger),
  );
  const imeiSocketIdRepository = new ImeiSocketIdFileRepository(
    path.join(filesPathShared, "imeiSocketIdLinks.json"),
    fileSystemAdapter,
  );

  const createByMessageLineContext = context.createModelByMessageLineContext;

  const updateState = new UpdateState();
  const updateConnectionModules = new UpdateConnectionModules(
    new UpdateConnectionModule(
      updateState,
      new UpdateConnectionState(
        updateState,
        new CloneConnectionState(new CloneState()),
      ),
    ),
    new CloneConnectionModule(
      new CloneConnectionState(
        new CloneState<
          typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
        >(),
      ),
      new CloneState<string>(),
    ),
  );
  const saveMessageLineContextToVehicle = new SaveVehicle(
    vehicleRepository,
    logger,
    true,
    new Update(
      new UpdateUnknown(
        new UpdateEnergy(updateState),
        updateConnectionModules,
        new UpdateIoT(
          new UpdateNetwork(updateConnectionModules),
          new UpdatePosition(updateState),
        ),
      ),
      new UpdateLockableScooter(
        new UpdateEnergy(updateState),
        updateConnectionModules,
        new UpdateIoT(
          new UpdateNetwork(updateConnectionModules),
          new UpdatePosition(updateState),
        ),
        new UpdateLockState(updateState),
        new UpdateSpeedometer(updateState),
      ),
    ),
  );

  const onData = new OnData(
    new HandleFirstPaket(
      imeiSocketIdRepository,
      saveMessageLineContextToVehicle,
      createByMessageLineContext,
      handleLockAttribute,
      acknowledge,
      logger,
      context.createMessageLineContext,
    ),
    new HandleNotFirstPaket(
      vehicleRepository,
      new UpdateVehicle(
        vehicleRepository,
        logger,
        new Update(
          new UpdateUnknown(
            new UpdateEnergy(updateState),
            updateConnectionModules,
            new UpdateIoT(
              new UpdateNetwork(updateConnectionModules),
              new UpdatePosition(updateState),
            ),
          ),
          new UpdateLockableScooter(
            new UpdateEnergy(updateState),
            updateConnectionModules,
            new UpdateIoT(
              new UpdateNetwork(updateConnectionModules),
              new UpdatePosition(updateState),
            ),
            new UpdateLockState(updateState),
            new UpdateSpeedometer(updateState),
          ),
        ),
      ),
      context.createMessageLineContextByProtocolAndVersion,
      createByMessageLineContext,
      handleLockAttribute,
      acknowledge,
      logger,
    ),
    logger,
    imeiSocketIdRepository,
  );

  const cleaner = new Cleanup(process, logger, imeiSocketIdRepository);
  cleaner.init();

  fromTcpInterface
    .consume(
      new ProcessFromTcpInterfaceMessage(
        onData,
        new OnDisconnection(imeiSocketIdRepository, vehicleRepository, logger),
        new TcpInterfaceMessageJsonConverter(logger),
      ),
    )
    .then();
}

run().then();
