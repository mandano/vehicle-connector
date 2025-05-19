import path from "node:path";

import dotenv from "dotenv";

import { OrphanedSocketFileSystemRepository } from "../../common/src/repositories/OrphanedSocketFileSystemRepository.ts";
import { LogLevels } from "../../common/src/logger/LogLevels.ts";
import { Logger } from "../../common/src/logger/Logger.ts";
import { FileSystemAdapter } from "../../common/src/adapters/FileSystemAdapter.ts";
import { WorkerQueue } from "../../common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { ExchangeQueue } from "../../common/src/adapters/queue/rabbitMq/ExchangeQueue.ts";
import { Exchange } from "../../common/src/adapters/queue/rabbitMq/Exchange.ts";
import { ImeiSocketIdFileRepository } from "../../common/src/repositories/ImeiSocketIdFileRepository.ts";
import { Channel } from "../../common/src/adapters/queue/rabbitMq/Channel.ts";
import { TcpInterfaceMessageJsonConverter } from "../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverter.ts";
import { HashColoredLogger } from "../../common/src/logger/HashColoredLogger.ts";
import BaseContext from "../../common/src/context/BaseContext.ts";
import RabbitMqConfig from "../../common/src/adapters/queue/rabbitMq/Config.ts";
import PathResolver from "../../common/src/adapters/fileSystem/PathResolver.ts";

import { Sockets } from "./socket/Sockets.ts";
import { OnData } from "./socket/from/onEventsHandler/OnData.ts";
import { OnDisconnection } from "./socket/from/onEventsHandler/OnDisconnection.ts";
import { OnConnection } from "./socket/from/onEventsHandler/OnConnection.ts";
import { TcpServer } from "./TcpServer.ts";
import { ProcessActionRequests } from "./socket/to/ProcessActionRequests.ts";
import { ProcessActionRequest } from "./socket/to/ProcessActionRequest.ts";
import { Config } from "./Config.ts";
import { Cleanup } from "./Cleanup.ts";

dotenv.config();
const config = new Config();

const tcpHost = process.env.TCP_HOST || "localhost";
const logger = new Logger(LogLevels.DEBUG_LEVEL);
const hashColoredLogger = new HashColoredLogger(LogLevels.DEBUG_LEVEL);
const fileSystemAdapter = new FileSystemAdapter(logger);
const pathResolver = new PathResolver();
const filesPathPrivate = pathResolver.run(
  process.env.FILES_PATH_PRIVATE || "tmp",
);
const filesPathShared = pathResolver.run(
  process.env.FILES_PATH_SHARED || "tmp",
);

const orphanedSocketRepository = new OrphanedSocketFileSystemRepository(
  path.join(filesPathPrivate, "orphanedSockets.json"),
  config.applicationName,
  fileSystemAdapter,
);
const sockets = new Sockets();
const rabbitMqPort = process.env.RABBITMQ_PORT
  ? parseInt(process.env.RABBITMQ_PORT)
  : 5672;
const rabbitMqHost = process.env.RABBITMQ_HOST || "localhost";
const rabbitMqConfig = new RabbitMqConfig(rabbitMqPort, rabbitMqHost);

const context = new BaseContext(rabbitMqConfig);
const rabbitMqChannel = new Channel(context.rabbitMq, logger);

const fromTcpInterface = new WorkerQueue(rabbitMqChannel, "fromTcpInterface");

const imeiSocketIdRepository = new ImeiSocketIdFileRepository(
  path.join(filesPathShared, "imeiSocketIdLinks.json"),
  fileSystemAdapter,
);

const onDisconnection = new OnDisconnection(
  orphanedSocketRepository,
  sockets,
  fromTcpInterface,
  imeiSocketIdRepository,
  new TcpInterfaceMessageJsonConverter(logger),
);

const cleanup = new Cleanup(
  process,
  logger,
  orphanedSocketRepository,
  sockets,
  onDisconnection,
);
cleanup.init();

async function start() {
  const server = new TcpServer(
    1234,
    tcpHost,
    new OnConnection(
      logger,
      orphanedSocketRepository,
      sockets,
      fromTcpInterface,
      new TcpInterfaceMessageJsonConverter(logger),
    ),
    onDisconnection,
    new OnData(
      logger,
      sockets,
      new WorkerQueue(rabbitMqChannel, "fromTcpInterface"),
      new TcpInterfaceMessageJsonConverter(logger),
    ),
    logger,
    sockets,
  );
  await server.start();

  const exchange = new Exchange(rabbitMqChannel, "toTcpInterface", logger);

  const tcpInterfaceMessageJsonConverter = new TcpInterfaceMessageJsonConverter(
    logger,
  );

  const processActionRequests = new ProcessActionRequests(
    new ExchangeQueue(
      rabbitMqChannel,
      new ProcessActionRequest(
        sockets,
        tcpInterfaceMessageJsonConverter,
        logger,
        hashColoredLogger,
      ),
      new ProcessActionRequest(
        sockets,
        tcpInterfaceMessageJsonConverter,
        logger,
        hashColoredLogger,
      ),
      exchange,
      "processActionRequests",
      logger,
      false,
    ),
  );
  processActionRequests.run();
}

start();
