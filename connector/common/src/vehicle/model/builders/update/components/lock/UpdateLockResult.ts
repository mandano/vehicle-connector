import Lock from "../../../../../components/lock/Lock.ts";
import LockChanges from "../../../../../components/lock/LockChanges.ts";

export default class UpdateLockResult {
  constructor(
    private readonly _new: Lock | undefined,
    private readonly _changes: LockChanges | undefined,
  ) {}

  get new(): Lock | undefined {
    return this._new;
  }

  get changes(): LockChanges | undefined {
    return this._changes;
  }
}
