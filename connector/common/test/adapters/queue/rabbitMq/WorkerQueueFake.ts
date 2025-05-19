import { WorkerQueueInterface } from "../../../../src/adapters/queue/WorkerQueueInterface.ts";
import { OnMessageInterface } from "../../../../src/adapters/queue/OnMessageInterface.ts";

export class WorkerQueueFake implements WorkerQueueInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async send(message: string): Promise<boolean> {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async consume(onMessage: OnMessageInterface): Promise<void> {
    return;
  }
}
