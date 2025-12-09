import Unknown from "../../models/Unknown.ts";
import { types as modelTypes } from "../../models/types.ts";
import LockableScooter from "../../models/LockableScooter.ts";

import UpdateUnknown from "./models/unknown/UpdateUnknown.ts";
import UpdateLockableScooter from "./models/lockableScooter/UpdateLockableScooter.ts";
import UpdateInterface from "./UpdateInterface.ts";
import UpdateResult from "./UpdateResult.ts";

export default class Update implements UpdateInterface {
  constructor(
    private _updateUnknown: UpdateUnknown,
    private _updateLockableScooter: UpdateLockableScooter,
  ) {}

  public run(
    toBeUpdated: modelTypes,
    updateBy: modelTypes,
  ): UpdateResult | undefined {
    if (updateBy instanceof Unknown && toBeUpdated instanceof Unknown) {
      const updateResult = this._updateUnknown.run(toBeUpdated, updateBy);

      return new UpdateResult(updateResult.new, updateResult.changes);
    }

    if (
      (updateBy instanceof LockableScooter || updateBy instanceof Unknown) &&
      toBeUpdated instanceof LockableScooter
    ) {
      const updateLockableScooterResult = this._updateLockableScooter.run(
        toBeUpdated,
        updateBy,
      );

      return new UpdateResult(
        updateLockableScooterResult.new,
        updateLockableScooterResult.changes,
      );
    }

    return undefined;
  }
}
