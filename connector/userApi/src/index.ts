import { Router as ExpressRouter } from "express";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import VehicleValkeyRepository from "common/src/repositories/vehicle/valkey/VehicleValkeyRepository.ts";
import ValkeyAdapter from "common/src/adapters/valkey/ValkeyAdapter.ts";
import { LogLevels } from "common/src/logger/LogLevels.ts";
import { Logger } from "common/src/logger/Logger.ts";
import { SendActionRequest } from "common/src/vehicle/model/actions/SendActionRequest.ts";
import { WorkerQueue } from "common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { Exchange } from "common/src/adapters/queue/rabbitMq/Exchange.ts";
import { ActionStateFromJson } from "common/src/vehicle/model/actions/json/ActionStateFromJson.ts";
import { Channel } from "common/src/adapters/queue/rabbitMq/Channel.ts";

import BaseContext from "../../common/src/context/BaseContext.ts";
import RabbitMqConfig from "../../common/src/adapters/queue/rabbitMq/Config.ts";

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
import IsConnected from "./routes/v1/vehicle/IsConnected.ts";
import DtoContext from "./../../common/src/vehicle/dto/_Context.ts";

const port = 3000;
dotenv.config();

const applicationName = "userApi";

const logger = new Logger(LogLevels.DEBUG_LEVEL);

const rabbitMqPort = process.env.RABBITMQ_PORT
  ? parseInt(process.env.RABBITMQ_PORT)
  : 5672;
const rabbitMqHost = process.env.RABBITMQ_HOST || "localhost";
const rabbitMqConfig = new RabbitMqConfig(rabbitMqPort, rabbitMqHost);

const context = new BaseContext(rabbitMqConfig);
const rabbitMqChannel = new Channel(context.rabbitMq, logger);
const dtoContext = new DtoContext(
  new SendActionRequest(new WorkerQueue(rabbitMqChannel, "action_requests")),
);

const vehicleRepository = new VehicleValkeyRepository(
  new ValkeyAdapter(logger, {
    host: process.env.VALKEY_HOST ?? "localhost",
    port: process.env.VALKEY_PORT ? parseInt(process.env.VALKEY_PORT) : 6379,
  }),
  logger,
  dtoContext.objectToDto().objectToDto(),
  dtoContext.dtoToVehicle().dtoToVehicle(),
  dtoContext.vehicleToObject(),
  dtoContext.dtoToObject(),
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
    new IsConnected(vehicleRepository, logger),
  ]),
  logger,
);
server.init();
server.listen();
