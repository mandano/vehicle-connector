import { WorkerQueue } from "../../../../connector/common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { OnMessageInterface } from "../../../../connector/common/src/adapters/queue/OnMessageInterface.ts";

export class VehicleAdHocUpdatePublisher {
  private _queue: WorkerQueue;
  private readonly _onMessage: OnMessageInterface;

  constructor(queue: WorkerQueue, onMessage: OnMessageInterface) {
    this._queue = queue;
    this._onMessage = onMessage;
  }

  public async run() {
    await this._queue.consume(this._onMessage);
  }
}
