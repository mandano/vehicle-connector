import {
  Channel as AmqplibChannel,
  ConsumeMessage,
  GetMessage,
  Options,
  Replies,
} from "amqplib";

import { LoggerInterface } from "../../../logger/LoggerInterface.ts";
import { OnMessageInterfaceV2 } from "../OnMessageInterfaceV2.ts";
import { Lock } from "../../../vehicle/components/lock/Lock.ts";
import { OnMessageInterface } from "../OnMessageInterface.ts";
import { OnMessageOnDemandInterface } from "../OnMessageOnDemandInterface.ts";

import { RabbitMqConnection } from "./RabbitMqConnection.ts";

// TODO: _connected probably not handled correctly
export class Channel {
  public static readonly EVENT_ON_CLOSE = "close";
  public static readonly EVENT_ON_ERROR = "error";
  public static readonly EVENT_ON_TIMEOUT = "timeout";

  private _channel?: AmqplibChannel;
  private _logger: LoggerInterface;
  private _connection: RabbitMqConnection;
  private _connected: boolean = false;
  private _consumerTag?: string;

  constructor(rabbitMq: RabbitMqConnection, logger: LoggerInterface) {
    this._connection = rabbitMq;
    this._logger = logger;
  }

  public async init(): Promise<boolean> {
    if (this._connected) {
      return true;
    }

    const connectionEstablished = await this._connection.init();

    if (!connectionEstablished) {
      return false;
    }

    this._channel = await this._connection.createChannel();

    if (this._channel === undefined) {
      return false;
    }

    this._connected = true;
    return this.addEventListeners();
  }

  private addEventListeners(): boolean {
    if (this._channel === undefined) {
      return false;
    }

    this._channel.on(Channel.EVENT_ON_CLOSE, () => {
      this._connected = false;

      this._logger.info("Channel closed", Channel.name);
    });
    this._channel.on(Channel.EVENT_ON_ERROR, (err) => {
      this._connected = false;

      this._logger.error(`Channel error: ${err}`, Channel.name);
    });
    this._channel.on(Channel.EVENT_ON_TIMEOUT, (err) => {
      this._connected = false;

      this._logger.error(`Channel timeout: ${err}`, Channel.name);
    });

    return true;
  }

  public async assertQueue(
    name: string,
    options?: Options.AssertQueue,
  ): Promise<boolean> {
    if (this._channel === undefined) {
      return false;
    }

    try {
      await this._channel.assertQueue(name, options);
      return true;
    } catch (error) {
      this._logger.error(`Failed to assert queue: ${error}`, Channel.name);
      return false;
    }
  }

  public async deleteQueue(name: string): Promise<boolean | undefined> {
    if (this._channel === undefined) {
      return undefined;
    }

    try {
      await this._channel.deleteQueue(name);
      return true;
    } catch (error) {
      this._logger.error(`Failed to delete queue: ${error}`, Channel.name);
      return false;
    }
  }

  public async assertExchange(
    name: string,
    type: string,
    options?: Options.AssertExchange,
  ): Promise<boolean> {
    if (this._channel === undefined) {
      return false;
    }

    try {
      await this._channel.assertExchange(name, type, options);
      return true;
    } catch (error) {
      this._logger.error(`Failed to assert exchange: ${error}`, Channel.name);
      return false;
    }
  }

  public async checkExchange(name: string): Promise<Replies.Empty | false> {
    if (this._channel === undefined) {
      return false;
    }

    try {
      return await this._channel.checkExchange(name);
    } catch (error) {
      this._logger.error(`Failed to check exchange: ${error}`, Channel.name);
      return false;
    }
  }

  public async deleteExchange(name: string): Promise<boolean | undefined> {
    if (this._channel === undefined) {
      return undefined;
    }

    try {
      await this._channel.deleteExchange(name);
      return true;
    } catch (error) {
      this._logger.error(`Failed to delete exchange: ${error}`, Channel.name);
      return false;
    }
  }

  public async publish(exchange: string, routingKey: string, content: Buffer) {
    if (this._channel === undefined) {
      return false;
    }

    try {
      return this._channel.publish(exchange, routingKey, content);
    } catch (error) {
      this._logger.error(`Failed to publish message: ${error}`, Channel.name);
      return false;
    }
  }

  public async bindQueue(
    queue: string,
    source: string,
    pattern: string,
  ): Promise<boolean> {
    if (this._channel === undefined) {
      return false;
    }

    try {
      await this._channel.bindQueue(queue, source, pattern);
      return true;
    } catch (error) {
      this._logger.error(`Failed to bind queue: ${error}`, Channel.name);
      return false;
    }
  }

  /**
   * Make sure queue is asserted before sending messages to it. This method does not check for it.
   *
   * @param name
   * @param message
   */
  public sendToQueue(name: string, message: string): boolean {
    if (this._channel === undefined) {
      return false;
    }

    try {
      return this._channel.sendToQueue(name, Buffer.from(message));
    } catch (error) {
      this._logger.error(
        `Failed to send message to queue: ${error}`,
        Channel.name,
      );
      return false;
    }
  }

  public ack(message: ConsumeMessage): void {
    if (this._channel === undefined) {
      return;
    }
    try {
      this._channel.ack(message);
    } catch (error) {
      this._logger.error(
        `Failed to acknowledge message: ${error}`,
        Channel.name,
      );
    }
  }

  public async consume(
    queue: string,
    onMessage: OnMessageInterface | OnMessageOnDemandInterface,
    ack: boolean,
  ): Promise<boolean> {
    if (this._channel === undefined) {
      return false;
    }

    const handleMessage = async (message: ConsumeMessage | null) => {
      if (message === null || message.content === undefined) {
        return false;
      }

      const messageAsString = message.content.toString();

      await onMessage.run(messageAsString);

      if (!ack) {
        return;
      }

      this.ack(message);
      return;
    };

    try {
      const { consumerTag } = await this._channel.consume(
        queue,
        handleMessage,
        { noAck: !ack },
      );
      this._consumerTag = consumerTag;
      return true;
    } catch (error) {
      this._logger.error(`Failed to consume messages: ${error}`, Channel.name);
      return false;
    }
  }

  public async consumeFromExchangeWithTimeout(
    queueName: string,
    onMessage: OnMessageInterfaceV2,
    ack: boolean,
    timeout: number,
    options?: {
      vehicleId?: number;
      targetState?: typeof Lock.LOCKED | typeof Lock.UNLOCKED;
    },
  ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const timer = setTimeout(async () => {
        resolve(false);
        await this.delete(queueName);
        this._logger.info(
          `Timeout while waiting for message on queue: ${queueName}`,
          Channel.name,
        );
        return;
      }, timeout);

      if (this._channel === undefined) {
        this._logger.error("Channel not initialized", Channel.name);
        return;
      }

      this._logger.info(
        `Start consuming for vehicleId ${options?.vehicleId}, queueName ${queueName}`,
        Channel.name,
      );

      try {
        const messageHandlerWithTimeout = this.createMessageHandlerWithTimeout(
          queueName,
          onMessage,
          ack,
          resolve,
          timer,
          options,
        );

        this._channel
          .consume(
            queueName,
            messageHandlerWithTimeout,
            { noAck: !ack },
          )
          .then();
      } catch (error) {
        this._logger.error(
          `Failed to consume messages: ${error}`,
          Channel.name,
        );
        resolve(false);
      }
    });
  }

  public async getMessage(queueName: string): Promise<string | false> {
    if (this._channel === undefined) {
      return false;
    }

    let message: GetMessage | false;

    try {
      message = await this._channel.get(queueName, { noAck: true });
    } catch (e) {
      this._logger.error(
        `Failed to get message from queue: ${e}`,
        Channel.name,
      );
      return false;
    }
    if (message !== false && message.content !== undefined) {
      return message.content.toString();
    }
    return false;
  }

  /**
   * Warning: closes channel in case of 404
   */
  public async checkQueue(
    queueName: string,
  ): Promise<Replies.AssertQueue | undefined> {
    if (this._channel === undefined) {
      return undefined;
    }

    try {
      return await this._channel.checkQueue(queueName);
    } catch (error) {
      this._logger.error(`Failed to check queue: ${error}`, Channel.name);
      return undefined;
    }
  }

  /**
   * At the moment per application the relation between connection and channel is 1:1.
   * Therefore, the connection will be closed as well.
   */
  public async close(): Promise<void> {
    this._channel?.removeAllListeners();
    try {
      await this._channel?.close();
    } catch (error) {
      this._logger.error(`Failed to close channel: ${error}`, Channel.name);
    }

    try {
      await this._connection.close();
    } catch (error) {
      this._logger.error(`Failed to close connection: ${error}`, Channel.name);
    }
  }

  private async delete(queueName: string): Promise<boolean | undefined> {
    if (this._channel === undefined) {
      return undefined;
    }

    try {
      const deleteQueue = await this._channel.deleteQueue(queueName);

      // TODO: does this condition make sense???
      if (deleteQueue.messageCount === 0) {
        return false;
      }
      return;
    } catch (error) {
      this._logger.error(`Failed to delete queue: ${error}`, Channel.name);
      return undefined;
    }
  }

  get channel(): AmqplibChannel | undefined {
    return this._channel;
  }

  get connected(): boolean {
    return this._connected;
  }

  private createMessageHandlerWithTimeout(
    queueName: string,
    onMessage: OnMessageInterfaceV2,
    ack: boolean,
    resolve: (value: boolean) => void,
    timer: NodeJS.Timeout,
    options?: {
      vehicleId?: number;
      targetState?: typeof Lock.LOCKED | typeof Lock.UNLOCKED;
    },
  ): (message: ConsumeMessage | null) => Promise<boolean | void> {
    return async (message: ConsumeMessage | null) => {
      if (message === null || message.content === undefined) {
        this._logger.error(
          `Received null message or message without content`,
          Channel.name,
        );
        return false;
      }

      const messageAsString = message.content.toString();
      const success = await onMessage.run(messageAsString, options);

      if (success) {
        clearTimeout(timer);
        await this.delete(queueName);
        resolve(true);
        return;
      }

      if (!ack) {
        return;
      }

      this.ack(message);
    };
  }
}

export default Channel;
