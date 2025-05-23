import { WorkerQueueInterface } from "../WorkerQueueInterface.ts";
import { OnMessageInterface } from "../OnMessageInterface.ts";
import { OnMessageOnDemandInterface } from "../OnMessageOnDemandInterface.ts";

import { Channel } from "./Channel.ts";

export class WorkerQueue implements WorkerQueueInterface {
  private readonly _durable: boolean;
  private readonly _name: string;
  private readonly _channel: Channel;
  private readonly _ack: boolean;

  constructor(
    channel: Channel,
    name: string,
    durable: boolean = false,
    ack: boolean = false,
  ) {
    this._channel = channel;
    this._durable = durable;
    this._name = name;
    this._ack = ack;
  }

  private async init(): Promise<boolean> {
    const initiated  = await this._channel.init();
    const asserted = await this.assert();

    return initiated && asserted;
  }

  private async assert(): Promise<boolean> {
    return await this._channel.assertQueue(this._name, {
      durable: this._durable,
    });
  }

  public async send(message: string): Promise<boolean> {
    const initiated = await this.init();

    if (!initiated) {
      return false;
    }

    return this._channel.sendToQueue(this._name, message);
  }

  public async consume(
    onMessage: OnMessageInterface | OnMessageOnDemandInterface,
  ): Promise<void> {
    const initiated = await this.init();

    if (!initiated) {
      return;
    }

    await this._channel.consume(this._name, onMessage, this._ack);
  }
}

export default WorkerQueue;
