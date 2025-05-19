import path from "node:path";

import dotenv from "dotenv";

import VehicleFileSystemRepository from "../../../../common/src/repositories/VehicleFileSystemRepository.ts";
import WorkerQueue from "../../../../common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import Exchange from "../../../../common/src/adapters/queue/rabbitMq/Exchange.ts";
import VehicleToJsonVehicle from "../../../../common/src/vehicle/json/vehicleToJsonVehicle/VehicleToJsonVehicle.ts";
import VehicleToJsonVehicleUnknown from "../../../../common/src/vehicle/json/vehicleToJsonVehicle/models/Unknown.ts";
import NetworkBuilder from "../../../../common/src/vehicle/json/vehicleToJsonVehicle/models/unknown/NetworkBuilder.ts";
import PositionBuilder from "../../../../common/src/vehicle/json/vehicleToJsonVehicle/models/unknown/PositionBuilder.ts";
import EnergyBuilder from "../../../../common/src/vehicle/json/vehicleToJsonVehicle/models/unknown/EnergyBuilder.ts";
import JsonVehicleToVehicle from "../../../../common/src/vehicle/json/jsonVehicleToVehicle/JsonVehicleToVehicle.ts";
import SetConnectionModules from "../../../../common/src/vehicle/json/jsonVehicleToVehicle/SetConnectionModules.ts";
import SetState from "../../../../common/src/vehicle/json/jsonVehicleToVehicle/SetState.ts";
import JsonVehicleToVehicleLockableScooter from "../../../../common/src/vehicle/json/jsonVehicleToVehicle/models/LockableScooter.ts";
import SendActionRequest from "../../../../common/src/vehicle/model/actions/SendActionRequest.ts";
import JsonVehicleToVehicleUnknown from "../../../../common/src/vehicle/json/jsonVehicleToVehicle/models/Unknown.ts";
import FileSystemAdapter from "../../../../common/src/adapters/FileSystemAdapter.ts";
import SendAction from "../../../../common/src/vehicle/actions/SendAction.ts";
import Logger from "../../../../common/src/logger/Logger.ts";
import LogLevels from "../../../../common/src/logger/LogLevels.ts";
import VehicleToJsonVehicleLockableScooter from "../../../../common/src/vehicle/json/vehicleToJsonVehicle/models/LockableScooter.ts";
import ImeiSocketIdFileRepository from "../../../../common/src/repositories/ImeiSocketIdFileRepository.ts";
import ActionStateFromJson from "../../../../common/src/vehicle/model/actions/json/ActionStateFromJson.ts";
import Channel from "../../../../common/src/adapters/queue/rabbitMq/Channel.ts";
import TcpInterfaceMessageJsonConverter from "../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverter.ts";
import HashColoredLogger from "../../../../common/src/logger/HashColoredLogger.ts";
import PublishAction from "../../../../../modules/protocols/common/src/connector/toVehicle/actions/PublishAction.ts";
import PublishTcpInterfaceMessage from "../../../../../modules/protocols/common/src/connector/toVehicle/actions/PublishTcpInterfaceMessage.ts";
import PathResolver from "../../../../common/src/adapters/fileSystem/PathResolver.ts";

import ProcessActionRequest from "./ProcessActionRequest.ts";
import loadContext from "./bootstrap/loadContext.ts";

async function run() {
  dotenv.config();

  const logger = new Logger(LogLevels.DEBUG_LEVEL);

  const context = await loadContext();

  const hashColoredLogger = new HashColoredLogger(LogLevels.DEBUG_LEVEL);

  const rabbitMqChannel = new Channel(context.rabbitMq, logger);
  const pathResolver = new PathResolver();
  const filesPathShared = pathResolver.run(
    process.env.FILES_PATH_SHARED || "tmp",
  );

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

  const exchange = new Exchange(rabbitMqChannel, "toTcpInterface", logger);

  const actionRequests = new WorkerQueue(
    rabbitMqChannel,
    "action_requests",
    false,
    true,
  );

  const imeiSocketIdRepository = new ImeiSocketIdFileRepository(
    path.join(filesPathShared, "imeiSocketIdLinks.json"),
    new FileSystemAdapter(logger),
  );
  const tcpInterfaceMessageJsonConverter = new TcpInterfaceMessageJsonConverter(
    logger,
  );

  actionRequests
    .consume(
      new ProcessActionRequest(
        vehicleRepository,
        new SendAction(
          new PublishAction(
            new PublishTcpInterfaceMessage(
              exchange,
              tcpInterfaceMessageJsonConverter,
            ),
            imeiSocketIdRepository,
          ),
          context.createMessageLine,
        ),
        logger,
        new ActionStateFromJson(logger),
        hashColoredLogger,
      ),
    )
    .then(() => {});
}

run().then();
