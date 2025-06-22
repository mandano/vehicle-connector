import LockState from "../../../../components/lock/LockState.ts";

import { UpdateState } from "./UpdateState.ts";

export class UpdateLockState {
  private _updateState: UpdateState;

  constructor(updateState: UpdateState) {
    this._updateState = updateState;
  }

  public run(toBeUpdated: LockState, updateBy: LockState): LockState {
    if (updateBy.state === undefined) {
      return toBeUpdated;
    }

    if (toBeUpdated.state === undefined) {
      toBeUpdated.state = updateBy.state;
    }

    if (toBeUpdated.state !== undefined) {
      const state = this._updateState.run(toBeUpdated.state, updateBy.state);
      if (state !== undefined) {
        toBeUpdated.state = state;
      }
    }

    return toBeUpdated;
  }
}
