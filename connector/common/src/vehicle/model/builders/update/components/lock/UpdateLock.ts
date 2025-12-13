import CloneLockState from "../../../../../components/lock/CloneLockState.ts";
import LockStateToChanges from "../../../../../components/lock/LockStateToChanges.ts";
import Lock from "../../../../../components/lock/Lock.ts";
import LockChanges from "../../../../../components/lock/LockChanges.ts";

import UpdateLockState from "./UpdateLockState.ts";
import UpdateLockResult from "./UpdateLockResult.ts";

export default class UpdateLock {
  constructor(
    private _updateLockState: UpdateLockState,
    private _cloneLockState: CloneLockState,
    private _lockStateToChanges: LockStateToChanges,
  ) {}

  public run(
    toBeUpdated: Lock | undefined,
    updateBy: Lock | undefined,
  ): UpdateLockResult {
    return this.update(toBeUpdated, updateBy);
  }

  private update(
    toBeUpdated: Lock | undefined,
    updateBy: Lock | undefined,
  ): UpdateLockResult {
    if (toBeUpdated === undefined && updateBy === undefined) {
      return new UpdateLockResult(undefined, undefined);
    }

    if (toBeUpdated === undefined) {
      const lockState = updateBy!.state;

      updateBy!.state =
        lockState !== undefined
          ? this._cloneLockState.run(lockState)
          : undefined;
      const lockStateChanges =
        lockState !== undefined
          ? this._lockStateToChanges.run(lockState)
          : undefined;
      const lockChanges = new LockChanges(lockStateChanges);

      return new UpdateLockResult(updateBy!, lockChanges);
    }

    if (updateBy === undefined) {
      const lockState = toBeUpdated!.state;

      toBeUpdated!.state =
        lockState !== undefined
          ? this._cloneLockState.run(lockState)
          : undefined;
      const lockStateChanges =
        lockState !== undefined
          ? this._lockStateToChanges.run(lockState)
          : undefined;
      const lockChanges = new LockChanges(lockStateChanges);

      return new UpdateLockResult(toBeUpdated!, lockChanges);
    }

    const updateLockStateResult = this._updateLockState.run(
      toBeUpdated.state,
      updateBy.state,
    );

    toBeUpdated.state = updateLockStateResult.new;

    const changes = updateLockStateResult.changes
      ? new LockChanges(updateLockStateResult.changes)
      : undefined;

    return new UpdateLockResult(toBeUpdated, changes);
  }
}
