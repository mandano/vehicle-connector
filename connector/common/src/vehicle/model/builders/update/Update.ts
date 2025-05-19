import { Unknown } from "../../models/Unknown.ts";
import { types as modelTypes } from "../../models/types.ts";
import { LockableScooter } from "../../models/LockableScooter.ts";

import { UpdateUnknown } from "./models/UpdateUnknown.ts";
import { UpdateLockableScooter } from "./models/UpdateLockableScooter.ts";
import { UpdateInterface } from "./UpdateInterface.ts";

export class Update implements UpdateInterface {
  constructor(
    private _updateUnknown: UpdateUnknown,
    private _updateLockableScooter: UpdateLockableScooter,
  ) {}

  public run(
    toBeUpdated: modelTypes,
    updateBy: modelTypes,
  ): modelTypes | undefined {
    if (updateBy instanceof Unknown && toBeUpdated instanceof Unknown) {
      return this._updateUnknown.run(toBeUpdated, updateBy);
    }

    if (
      (updateBy instanceof LockableScooter || updateBy instanceof Unknown) &&
      toBeUpdated instanceof LockableScooter
    ) {
      return this._updateLockableScooter.run(toBeUpdated, updateBy);
    }

    return undefined;
  }
}
