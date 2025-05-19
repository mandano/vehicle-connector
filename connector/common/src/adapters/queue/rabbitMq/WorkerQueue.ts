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

  private async init(): Promise<void> {
    await this._channel.init();
    await this.assert();
  }

  private async assert(): Promise<boolean> {
    return await this._channel.assertQueue(this._name, {
      durable: this._durable,
    });
  }

  public async send(message: string): Promise<boolean> {
    await this.init();

    return this._channel.sendToQueue(this._name, message);
  }

  public async consume(
    onMessage: OnMessageInterface | OnMessageOnDemandInterface,
  ): Promise<void> {
    await this.init();

    await this._channel.consume(this._name, onMessage, this._ack);
  }
}

export default WorkerQueue;
