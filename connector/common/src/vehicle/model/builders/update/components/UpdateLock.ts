import { Lock } from "../../../../components/lock/Lock.ts";

import { UpdateState } from "./UpdateState.ts";

export class UpdateLock {
  private _updateState: UpdateState;

  constructor(updateState: UpdateState) {
    this._updateState = updateState;
  }

  public run(toBeUpdated: Lock, updateBy: Lock): Lock {
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
