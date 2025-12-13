import CloneState from "../../model/CloneState.ts";

import LockState from "./LockState.ts";

export default class CloneLockState {
  constructor(
    private _cloneState: CloneState<
      typeof LockState.LOCKED | typeof LockState.UNLOCKED
    >,
  ) {}

  public run(lockState: LockState): LockState {
    const clonedState = this._cloneState.run(lockState.state);

    return new LockState(clonedState);
  }
}
