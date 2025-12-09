import LockState from "../../../../../components/lock/LockState.ts";
import LockStateChanges from "../../../../../components/lock/LockStateChanges.ts";

export default class UpdateLockStateResult {
  constructor(
    private readonly _new: LockState | undefined,
    private readonly _changes: LockStateChanges | undefined,
  ) {}

  get new(): LockState | undefined {
    return this._new;
  }

  get changes(): LockStateChanges | undefined {
    return this._changes;
  }
}
