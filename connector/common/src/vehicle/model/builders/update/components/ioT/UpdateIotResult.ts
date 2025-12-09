import IoT from "../../../../../components/iot/IoT.ts";

import IotChanges from "./IotChanges.ts";

export default class UpdateIotResult {
  constructor(
    private readonly _new: IoT | undefined,
    private readonly _changes: IotChanges | undefined = undefined,
  ) {}

  get new(): IoT | undefined {
    return this._new;
  }

  get changes(): IotChanges | undefined {
    return this._changes;
  }
}
