import { ExchangeInterface } from "../ExchangeInterface.ts";
import { LoggerInterface } from "../../../logger/LoggerInterface.ts";

import { Channel } from "./Channel.ts";

export class Exchange implements ExchangeInterface {
  private readonly _durable: boolean;
  private readonly _name: string;
  private readonly _channel: Channel;
  private readonly _logger: LoggerInterface;
  public static TYPE_FANOUT = "fanout";

  constructor(
    channel: Channel,
    name: string,
    logger: LoggerInterface,
    durable: boolean = false,
  ) {
    this._channel = channel;
    this._durable = durable;
    this._name = name;
    this._logger = logger;
  }

  public async init(): Promise<boolean> {
    const channelInitiated = await this._channel.init();
    if (!channelInitiated) {
      return false;
    }

    return await this.assert();
  }

  private async assert(): Promise<boolean> {
    try {
      await this._channel.assertExchange(this._name, Exchange.TYPE_FANOUT, {
        durable: this._durable,
      });
      return true;
    } catch (error) {
      this._logger.error(`Failed to assert exchange: ${error}`, Exchange.name);
      return false;
    }
  }

  public async publish(message: string): Promise<boolean | undefined> {
    await this.init();
    if (this._channel === undefined) {
      return undefined;
    }

    this._logger.info(`Publishing to channel ${message}`);

    return this._channel.publish(this._name, "", Buffer.from(message));
  }

  get name(): string {
    return this._name;
  }
}

export default Exchange;
