import dotenv from "dotenv";
import DtoContext from "common/src/vehicle/dto/_Context.ts";
import VehicleValkeyRepository from "common/src/repositories/vehicle/valkey/VehicleValkeyRepository.ts";
import ValkeyAdapter from "common/src/adapters/valkey/ValkeyAdapter.ts";

import WorkerQueue from "../../../../common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import Exchange from "../../../../common/src/adapters/queue/rabbitMq/Exchange.ts";
import SendActionRequest from "../../../../common/src/vehicle/model/actions/SendActionRequest.ts";
import SendAction from "../../../../common/src/vehicle/actions/SendAction.ts";
import Logger from "../../../../common/src/logger/Logger.ts";
import LogLevels from "../../../../common/src/logger/LogLevels.ts";
import ImeiSocketIdRepository from "../../../../common/src/repositories/imeiSocketId/ImeiSocketIdValkeyRepository.ts";
import ActionStateFromJson from "../../../../common/src/vehicle/model/actions/json/ActionStateFromJson.ts";
import Channel from "../../../../common/src/adapters/queue/rabbitMq/Channel.ts";
import TcpInterfaceMessageJsonConverter from "../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverter.ts";
import HashColoredLogger from "../../../../common/src/logger/HashColoredLogger.ts";
import PublishAction from "../../../../../modules/protocols/common/src/connector/toVehicle/actions/PublishAction.ts";
import PublishTcpInterfaceMessage from "../../../../../modules/protocols/common/src/connector/toVehicle/actions/PublishTcpInterfaceMessage.ts";

import ProcessActionRequest from "./ProcessActionRequest.ts";
import loadContext from "./bootstrap/loadContext.ts";

async function run() {
  dotenv.config();

  const logger = new Logger(LogLevels.DEBUG_LEVEL);

  const context = await loadContext();

  const hashColoredLogger = new HashColoredLogger(LogLevels.DEBUG_LEVEL);

  const rabbitMqChannel = new Channel(context.rabbitMq, logger);

  const dtoContext = new DtoContext(
    new SendActionRequest(new WorkerQueue(rabbitMqChannel, "action_requests")),
  );

  const valkeyAdapter = new ValkeyAdapter(logger, {
    host: process.env.VALKEY_HOST ?? "localhost",
    port: process.env.VALKEY_PORT ? parseInt(process.env.VALKEY_PORT) : 6379,
  });

  const vehicleRepository = new VehicleValkeyRepository(
    valkeyAdapter,
    logger,
    dtoContext.objectToDto().objectToDto(),
    dtoContext.dtoToVehicle().dtoToVehicle(),
    dtoContext.vehicleToObject(),
    dtoContext.dtoToObject(),
  );

  const exchange = new Exchange(rabbitMqChannel, "toTcpInterface", logger);

  const actionRequests = new WorkerQueue(
    rabbitMqChannel,
    "action_requests",
    false,
    true,
  );

  const imeiSocketIdRepository = new ImeiSocketIdRepository(
    valkeyAdapter,
    logger,
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
        hashColoredLogger,
        new ActionStateFromJson(logger),
      ),
    )
    .then(() => {});
}

run().then();
