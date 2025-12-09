import LockState from "../../../../../components/lock/LockState.ts";
import LockStates from "../../../../../components/lock/LockStates.ts";
import UpdateStateNoUndefined from "../state/noUndefined/UpdateStateNoUndefined.ts";
import CloneLockState from "../../../../../components/lock/CloneLockState.ts";
import LockStateToChanges from "../../../../../components/lock/LockStateToChanges.ts";
import LockStateChanges from "../../../../../components/lock/LockStateChanges.ts";

import UpdateLockStateResult from "./UpdateLockStateResult.ts";

export default class UpdateLockState {
  constructor(
    private _updateState: UpdateStateNoUndefined,
    private _cloneLockState: CloneLockState,
    private _lockStateToChanges: LockStateToChanges,
  ) {}

  public run(
    toBeUpdated: LockState | undefined,
    updateBy: LockState | undefined,
  ): UpdateLockStateResult {
    return this.update(toBeUpdated, updateBy);
  }

  private update(
    toBeUpdated: LockState | undefined,
    updateBy: LockState | undefined,
  ): UpdateLockStateResult {
    if (toBeUpdated === undefined && updateBy === undefined) {
      return new UpdateLockStateResult(undefined, undefined);
    }

    if (toBeUpdated === undefined) {
      const changes = this._lockStateToChanges.run(updateBy!);

      return new UpdateLockStateResult(
        this._cloneLockState.run(updateBy!),
        changes,
      );
    }

    if (updateBy === undefined) {
      return new UpdateLockStateResult(
        this._cloneLockState.run(toBeUpdated!),
        undefined,
      );
    }

    const updateResult = this._updateState.run<LockStates>(
      toBeUpdated.state,
      updateBy.state,
    );

    const lockState = new LockState(updateResult.new);

    const changes = updateResult.changes ? new LockStateChanges(updateResult.changes) : undefined;

    return new UpdateLockStateResult(lockState, changes);
  }
}
