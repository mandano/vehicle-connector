import { WorkerQueue } from "../../../adapters/queue/rabbitMq/WorkerQueue.ts";

import { ActionState } from "./ActionState.ts";
import { SendActionRequestInterface } from "./SendActionRequestInterface.ts";
import { ActionStateToJson } from "./json/ActionStateToJson.ts";

export class SendActionRequest implements SendActionRequestInterface {
  private _workerQueue: WorkerQueue;

  constructor(workerQueue: WorkerQueue) {
    this._workerQueue = workerQueue;
  }

  public async run(actionRequest: ActionState): Promise<boolean | undefined> {
    const message = ActionStateToJson.run(actionRequest);

    if (message === undefined) {
      return undefined;
    }

    return await this._workerQueue.send(message);
  }
}

export default SendActionRequest;

