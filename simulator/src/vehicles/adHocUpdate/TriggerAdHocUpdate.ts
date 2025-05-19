import { WorkerQueueInterface } from "../../../../connector/common/src/adapters/queue/WorkerQueueInterface.ts";

import { AdHocUpdate } from "./AdHocUpdate.ts";
import { AdHocUpdateJsonConverter } from "./AdHocUpdateJsonConverter.ts";

export class TriggerAdHocUpdate {
  private _queue: WorkerQueueInterface;
  private _adHocUpdateJsonConverter: AdHocUpdateJsonConverter;

  constructor(
    queue: WorkerQueueInterface,
    adHocUpdateJsonConverter: AdHocUpdateJsonConverter,
  ) {
    this._queue = queue;
    this._adHocUpdateJsonConverter = adHocUpdateJsonConverter;
  }

  public async run(adHocUpdate: AdHocUpdate): Promise<boolean> {
    const adHocUpdateAsJsonStr =
      this._adHocUpdateJsonConverter.toJson(adHocUpdate);

    return await this._queue.send(adHocUpdateAsJsonStr);
  }
}
