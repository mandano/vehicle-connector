import LockableScooter from "../../../../models/LockableScooter.ts";

import LockableScooterChanges from "./LockableScooterChanges.ts";

export default class UpdateLockableScooterResult {
  constructor(
    private readonly _new: LockableScooter,
    private readonly _changes: LockableScooterChanges,
  ) {}

  get new(): LockableScooter {
    return this._new;
  }

  get changes(): LockableScooterChanges {
    return this._changes;
  }
}
