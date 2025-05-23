import path from "node:path";

import { Router as ExpressRouter } from "express";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import VehicleFileSystemRepository from "../../common/src/repositories/VehicleFileSystemRepository.ts";
import { LogLevels } from "../../common/src/logger/LogLevels.ts";
import { Logger } from "../../common/src/logger/Logger.ts";
import { FileSystemAdapter } from "../../common/src/adapters/FileSystemAdapter.ts";
import { VehicleToJsonVehicle } from "../../common/src/vehicle/json/vehicleToJsonVehicle/VehicleToJsonVehicle.ts";
import { Unknown as VehicleToJsonVehicleUnknown } from "../../common/src/vehicle/json/vehicleToJsonVehicle/models/Unknown.ts";
import { NetworkBuilder } from "../../common/src/vehicle/json/vehicleToJsonVehicle/models/unknown/NetworkBuilder.ts";
import { PositionBuilder } from "../../common/src/vehicle/json/vehicleToJsonVehicle/models/unknown/PositionBuilder.ts";
import { EnergyBuilder } from "../../common/src/vehicle/json/vehicleToJsonVehicle/models/unknown/EnergyBuilder.ts";
import { JsonVehicleToVehicle } from "../../common/src/vehicle/json/jsonVehicleToVehicle/JsonVehicleToVehicle.ts";
import { SetConnectionModules } from "../../common/src/vehicle/json/jsonVehicleToVehicle/SetConnectionModules.ts";
import { SetState } from "../../common/src/vehicle/json/jsonVehicleToVehicle/SetState.ts";
import { LockableScooter as JsonVehicleToVehicleLockableScooter } from "../../common/src/vehicle/json/jsonVehicleToVehicle/models/LockableScooter.ts";
import { SendActionRequest } from "../../common/src/vehicle/model/actions/SendActionRequest.ts";
import { WorkerQueue } from "../../common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { Unknown as JsonVehicleToVehicleUnknown } from "../../common/src/vehicle/json/jsonVehicleToVehicle/models/Unknown.ts";
import { LockableScooter as VehicleToJsonVehicleLockableScooter } from "../../common/src/vehicle/json/vehicleToJsonVehicle/models/LockableScooter.ts";
import { Exchange } from "../../common/src/adapters/queue/rabbitMq/Exchange.ts";
import { ActionStateFromJson } from "../../common/src/vehicle/model/actions/json/ActionStateFromJson.ts";
import { Channel } from "../../common/src/adapters/queue/rabbitMq/Channel.ts";
import BaseContext from "../../common/src/context/BaseContext.ts";
import RabbitMqConfig from "../../common/src/adapters/queue/rabbitMq/Config.ts";
import PathResolver from "../../common/src/adapters/fileSystem/PathResolver.ts";

import CreateVehicle from "./routes/v1/vehicle/Create.ts";
import { Get } from "./routes/v1/vehicle/Get.ts";
import { Router } from "./routes/v1/Router.ts";
import { HttpExpressServer } from "./HttpExpressServer.ts";
import { SwaggerConfig as SwaggerConfigV1 } from "./routes/v1/SwaggerConfig.ts";
import { Lock } from "./routes/v1/vehicle/Lock.ts";
import { Unlock } from "./routes/v1/vehicle/Unlock.ts";
import { GetByImei } from "./routes/v1/vehicle/GetByImei.ts";
import { UpdateModelName } from "./routes/v1/vehicle/UpdateModelName.ts";
import { HandleLockResponseV2 } from "./routes/v1/vehicle/lock/HandleLockResponseV2.ts";
import { Get as GetMap } from "./routes/v1/vehicles/map/Get.ts";
import ModelsCreateGet from "./routes/v1/models/create/Get.ts";
import { Queue } from "./routes/v1/health/Queue.ts";

const port = 3000;
const pathResolver = new PathResolver();
dotenv.config();
const filesPathShared = pathResolver.run(
  process.env.FILES_PATH_SHARED || "tmp",
);
const applicationName = "userApi";

const logger = new Logger(LogLevels.DEBUG_LEVEL);

const fileSystemAdapter = new FileSystemAdapter(logger);
const rabbitMqPort = process.env.RABBITMQ_PORT
  ? parseInt(process.env.RABBITMQ_PORT)
  : 5672;
const rabbitMqHost = process.env.RABBITMQ_HOST || "localhost";
const rabbitMqConfig = new RabbitMqConfig(rabbitMqPort, rabbitMqHost);

const context = new BaseContext(rabbitMqConfig);
const rabbitMqChannel = new Channel(context.rabbitMq, logger);
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

const exchange = new Exchange(rabbitMqChannel, "action_responses", logger);

const handleLockResponseV2 = new HandleLockResponseV2(
  new ActionStateFromJson(logger),
  logger,
);

const server = new HttpExpressServer(
  port,
  express(),
  new SwaggerConfigV1(port),
  bodyParser.json(),
  new Router(ExpressRouter(), [
    new Get(vehicleRepository),
    new GetByImei(vehicleRepository),
    new Lock(
      vehicleRepository,
      rabbitMqChannel,
      handleLockResponseV2,
      exchange,
      applicationName,
      logger,
    ),
    new Unlock(
      vehicleRepository,
      rabbitMqChannel,
      handleLockResponseV2,
      exchange,
      applicationName,
      logger,
    ),
    new UpdateModelName(vehicleRepository),
    new GetMap(vehicleRepository),
    new Queue(context.rabbitMq),
    new ModelsCreateGet(),
    new CreateVehicle(vehicleRepository),
  ]),
  logger,
);
server.init();
server.listen();
