import { randomUUID } from "node:crypto";

import { Lock } from "../../../vehicle/components/lock/Lock.ts";
import { OnMessageInterfaceV2 } from "../OnMessageInterfaceV2.ts";
import { LoggerInterface } from "../../../logger/LoggerInterface.ts";

import { Exchange } from "./Exchange.ts";
import { Channel } from "./Channel.ts";

export class ExchangeQueue {
  private readonly _name: string;
  private readonly _channel: Channel;
  private readonly _consume: OnMessageInterfaceV2;
  private readonly _consumeWithTimeout: OnMessageInterfaceV2;
  private readonly _ack: boolean;
  private _exchange: Exchange;
  private readonly _applicationName: string;
  private readonly _useDynamicNameAppendix;
  private readonly _logger: LoggerInterface;
  private _executedInitSuccessfully: boolean = false;

  constructor(
    channel: Channel,
    consume: OnMessageInterfaceV2,
    consumeWithTimeout: OnMessageInterfaceV2,
    exchange: Exchange,
    applicationName: string,
    logger: LoggerInterface,
    ack: boolean = false,
    useDynamicNameAppendix: boolean = true,
  ) {
    this._channel = channel;
    this._consume = consume;
    this._consumeWithTimeout = consumeWithTimeout;
    this._ack = ack;
    this._exchange = exchange;
    this._applicationName = applicationName;
    this._logger = logger;
    this._useDynamicNameAppendix = useDynamicNameAppendix;

    if (this._useDynamicNameAppendix) {
      this._name = `${this._exchange.name}_${this._applicationName}_${randomUUID()}`;
    } else {
      this._name = `${this._exchange.name}_${this._applicationName}`;
    }
  }

  get name(): string {
    return this._name;
  }

  public async init(): Promise<boolean> {
    const channelInitiated = await this._channel.init();
    if (!channelInitiated) {
      return false;
    }

    const exchangeInitiated = await this._exchange.init();

    if (!exchangeInitiated) {
      return false;
    }
    const asserted = await this.assert();

    if (!asserted) {
      return false;
    }

    const bound = this.bind();

    if (!bound) {
      return false;
    }

    this._executedInitSuccessfully = true;
    return true;
  }

  private async assert(): Promise<boolean> {
    try {
      await this._channel.assertQueue(this._name, { exclusive: true });
      return true;
    } catch (error) {
      this._logger.error(`Failed to assert queue: ${error}`, Channel.name);
      return false;
    }
  }

  private async bind(): Promise<boolean> {
    try {
      await this._channel.bindQueue(this._name, this._exchange.name, "");
      return true;
    } catch (error) {
      this._logger.error(`Failed to bind queue: ${error}`, Channel.name);
      return false;
    }
  }

  /**
   * Init has to be executed beforehand.
   *
   * @param timeout
   * @param options
   */
  public async consumeWithTimeout(
    timeout: number = 20000,
    options?: {
      vehicleId?: number;
      targetState?: typeof Lock.LOCKED | typeof Lock.UNLOCKED;
    },
  ): Promise<boolean | undefined> {
    if (this._executedInitSuccessfully === false) {
      this._logger.error("Queue not initialized", ExchangeQueue.name);

      return undefined;
    }

    if (this._channel === undefined) {
      return undefined;
    }

    return await this._channel.consumeFromExchangeWithTimeout(
      this._name,
      this._consumeWithTimeout,
      true,
      timeout,
      options,
    );
  }

  public async consume(): Promise<boolean> {
    await this.init();
    if (this._channel === undefined) {
      return false;
    }

    return await this._channel.consume(this._name, this._consume, this._ack);
  }
}
