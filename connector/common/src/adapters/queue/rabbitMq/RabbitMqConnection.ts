import amqp, { Channel, Connection } from "amqplib";

import { LoggerInterface } from "../../../logger/LoggerInterface.ts";

export class RabbitMqConnection {
  public static EVENT_CLOSE = "close";
  public static EVENT_ERROR = "error";
  public static EVENT_BLOCKED = "blocked";
  public static EVENT_UNBLOCKED = "unblocked";
  private static CONNECTION_TIMEOUT = 2500;

  private _url: string;
  private _connection: amqp.Connection | undefined;
  private _logger: LoggerInterface;
  private _connected: boolean = false;
  private readonly _retry: boolean;
  private readonly _retryIntervalMilliseconds: number;
  private _attemptAt: Date | undefined;
  private _establishedAt: Date | undefined;
  private _error: string | undefined;
  private _connectionAttemptOnGoing: boolean = false;

  constructor(
    url: string,
    logger: LoggerInterface,
    retry: boolean = false,
    retryIntervalMilliseconds: number = 5000,
    private _suspendRetryAfterMilliseconds = 60000,
  ) {
    this._url = url;
    this._logger = logger;
    this._retry = retry;
    this._retryIntervalMilliseconds = retryIntervalMilliseconds;
  }

  public async init(): Promise<boolean> {
    if (this._connected) {
      return true;
    }

    this._connection = await this.connect();

    if (this._connection === undefined || !this._connected) {
      await this.retryConnect();
    }

    if (this._connection === undefined || !this._connected) {
      return false;
    }

    return this.addEventListeners();
  }

  set url(url: string) {
    this._url = url;
  }

  private async retryConnect(): Promise<void> {
    const initialRetryTime = new Date();

    while (
      this._connection === undefined &&
      this._retry &&
      new Date().getTime() - initialRetryTime.getTime()  <
        this._suspendRetryAfterMilliseconds
    ) {
      await this.sleep(this._retryIntervalMilliseconds);

      this._logger.error("Retrying connecting.", RabbitMqConnection.name);
      this._connection = await this.connect();
    }

    if (this._connected === false) {
      this._logger.error(
        "Failed to connect to RabbitMQ",
        RabbitMqConnection.name,
      );
    } else if (this._connected === true) {
      this._logger.log("Connected to RabbitMQ", RabbitMqConnection.name);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async connect(): Promise<Connection | undefined> {
    if (this._connectionAttemptOnGoing === true) {
      this._logger.error(
        "Other connection attempt is ongoing",
        RabbitMqConnection.name,
      );

      return undefined;
    }

    try {
      this._attemptAt = new Date();
      this._connectionAttemptOnGoing = true;

      // TODO: add tests to check if timeout works as expected
      const connection = await amqp.connect(this._url, {
        timeout: RabbitMqConnection.CONNECTION_TIMEOUT,
      });

      this._connected = true;
      this._establishedAt = new Date();
      this._error = undefined;
      this._connectionAttemptOnGoing = false;

      return connection;
    } catch (error: unknown) {
      this._error =
        error && typeof error === "object" && "code" in error
          ? (error as { code?: string }).code
          : String(error);
      this._logger.error(
        `Connection error: ${this._error}, using ${this._url}`,
        RabbitMqConnection.name,
      );
      this._connectionAttemptOnGoing = false;

      return undefined;
    }
  }

  public connection(): Connection | undefined {
    return this._connection;
  }

  private addEventListeners(): boolean {
    if (this._connection === undefined) {
      return false;
    }

    this._connection.on(RabbitMqConnection.EVENT_CLOSE, () => {
      this._logger.error("Connection closed", RabbitMqConnection.name);
      this._connected = false;
      this._establishedAt = undefined;
      this._attemptAt = undefined;
    });

    this._connection.on(RabbitMqConnection.EVENT_ERROR, (err) => {
      this._logger.error(`Connection error: ${err}`, RabbitMqConnection.name);
      this._connected = false;
      this._establishedAt = undefined;
      this._attemptAt = undefined;
    });

    this._connection.on(RabbitMqConnection.EVENT_BLOCKED, (reason) => {
      this._logger.error(
        `Connection blocked: ${reason}`,
        RabbitMqConnection.name,
      );
    });

    this._connection.on(RabbitMqConnection.EVENT_UNBLOCKED, () => {
      this._logger.log("Connection unblocked", RabbitMqConnection.name);
    });

    return true;
  }

  public async createChannel(): Promise<Channel | undefined> {
    if (this._connection === undefined || !this._connected) {
      return undefined;
    }

    try {
      return await this._connection.createChannel();
    } catch (error) {
      this._logger.error(
        `Failed to create channel: ${error}`,
        RabbitMqConnection.name,
      );
      return undefined;
    }
  }

  public async close(): Promise<void> {
    if (this._connection === undefined) {
      return;
    }

    this._connection.removeAllListeners();
    try {
      await this._connection.close();
      // TODO: needed?: this._connected = false; - listener will set it to false
    } catch (error) {
      this._logger.error(
        `Failed to close connection: ${error}`,
        RabbitMqConnection.name,
      );
    }
  }

  get connected(): boolean {
    return this._connected;
  }

  get attemptAt(): Date | undefined {
    return this._attemptAt;
  }

  get establishedAt(): Date | undefined {
    return this._establishedAt;
  }

  get error(): string | undefined {
    return this._error;
  }
}

export default RabbitMqConnection;
