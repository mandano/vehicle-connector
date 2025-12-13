import Changes from "../models/changes.ts";
import WorkerQueueInterface from "../../../../../adapters/queue/WorkerQueueInterface.ts";

export default class PublishChanges {
  constructor(private _workerQueue: WorkerQueueInterface) {}

  public async run(changes: Changes): Promise<boolean | undefined> {
    const message = JSON.stringify(changes);
    if (message === undefined) {
      return undefined;
    }

    return await this._workerQueue.send(message);
  }
}
