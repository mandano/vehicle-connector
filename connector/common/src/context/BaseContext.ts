import RabbitMqConnection from "../adapters/queue/rabbitMq/RabbitMqConnection.ts";
import Logger from "../logger/Logger.ts";
import LogLevels from "../logger/LogLevels.ts";
import LoggerInterface from "../logger/LoggerInterface.ts";
import RabbitMqConfig from "../adapters/queue/rabbitMq/Config.ts";

export default class BaseContext {
  private _logger: LoggerInterface | undefined;
  private _rabbitMq: RabbitMqConnection | undefined;

  constructor(protected readonly rabbitMqConfig: RabbitMqConfig) {}

  get logger(): LoggerInterface {
    if (!this._logger) {
      this._logger = new Logger(LogLevels.DEBUG_LEVEL);
    }
    return this._logger;
  }

  get rabbitMq(): RabbitMqConnection {
    if (!this._rabbitMq) {
      this._rabbitMq = new RabbitMqConnection(
        this.rabbitMqConfig.url(),
        this.logger,
        this.rabbitMqConfig.retry,
      );
    }
    return this._rabbitMq;
  }
}
