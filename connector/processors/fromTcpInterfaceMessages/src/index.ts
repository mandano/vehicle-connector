import path from "node:path";

import dotenv from "dotenv";

import VehicleFileSystemRepository from "../../../common/src/repositories/VehicleFileSystemRepository.ts";
import { WorkerQueue } from "../../../common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { Exchange } from "../../../common/src/adapters/queue/rabbitMq/Exchange.ts";
import { VehicleToJsonVehicle } from "../../../common/src/vehicle/json/vehicleToJsonVehicle/VehicleToJsonVehicle.ts";
import { Unknown as VehicleToJsonVehicleUnknown } from "../../../common/src/vehicle/json/vehicleToJsonVehicle/models/Unknown.ts";
import { NetworkBuilder } from "../../../common/src/vehicle/json/vehicleToJsonVehicle/models/unknown/NetworkBuilder.ts";
import { PositionBuilder } from "../../../common/src/vehicle/json/vehicleToJsonVehicle/models/unknown/PositionBuilder.ts";
import { EnergyBuilder } from "../../../common/src/vehicle/json/vehicleToJsonVehicle/models/unknown/EnergyBuilder.ts";
import { JsonVehicleToVehicle } from "../../../common/src/vehicle/json/jsonVehicleToVehicle/JsonVehicleToVehicle.ts";
import { SetConnectionModules } from "../../../common/src/vehicle/json/jsonVehicleToVehicle/SetConnectionModules.ts";
import { SetState } from "../../../common/src/vehicle/json/jsonVehicleToVehicle/SetState.ts";
import { LockableScooter as JsonVehicleToVehicleLockableScooter } from "../../../common/src/vehicle/json/jsonVehicleToVehicle/models/LockableScooter.ts";
import { SendActionRequest } from "../../../common/src/vehicle/model/actions/SendActionRequest.ts";
import { Unknown as JsonVehicleToVehicleUnknown } from "../../../common/src/vehicle/json/jsonVehicleToVehicle/models/Unknown.ts";
import { FileSystemAdapter } from "../../../common/src/adapters/FileSystemAdapter.ts";
import { Logger } from "../../../common/src/logger/Logger.ts";
import { LogLevels } from "../../../common/src/logger/LogLevels.ts";
import { LockableScooter as VehicleToJsonVehicleLockableScooter } from "../../../common/src/vehicle/json/vehicleToJsonVehicle/models/LockableScooter.ts";
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
import { UpdateConnectionModules } from "../../../common/src/vehicle/model/builders/update/components/UpdateConnectionModules.ts";
import { UpdateLockableScooter } from "../../../common/src/vehicle/model/builders/update/models/UpdateLockableScooter.ts";
import { UpdateLock } from "../../../common/src/vehicle/model/builders/update/components/UpdateLock.ts";
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

  const fileSystemAdapter = new FileSystemAdapter(logger);
  const vehicleRepository = new VehicleFileSystemRepository(
    path.join(filesPathShared, "vehicles.json"),
    fileSystemAdapter,
    new VehicleToJsonVehicle(
      new VehicleToJsonVehicleUnknown(
        new NetworkBuilder(),
        new PositionBuilder(),
        new EnergyBuilder(),
      ),
      new VehicleToJsonVehicleLockableScooter(
        new NetworkBuilder(),
        new PositionBuilder(),
        new EnergyBuilder(),
      ),
    ),
    new JsonVehicleToVehicle(
      new JsonVehicleToVehicleLockableScooter(
        new SetConnectionModules(new SetState()),
        new SetState(),
        new SendActionRequest(
          new WorkerQueue(rabbitMqChannel, "action_requests"),
        ),
      ),
      new JsonVehicleToVehicleUnknown(
        new SetConnectionModules(new SetState()),
        new SetState(),
      ),
    ),
  );

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
  const updateConnectionModules = new UpdateConnectionModules(updateState);
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
        new UpdateLock(updateState),
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
            new UpdateLock(updateState),
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
