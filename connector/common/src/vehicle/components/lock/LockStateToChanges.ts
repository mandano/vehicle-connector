import StateToChanges from "../../model/builders/update/components/state/StateToChanges.ts";

import LockStateChanges from "./LockStateChanges.ts";
import LockState from "./LockState.ts";

export default class LockStateToChanges {
  constructor(private _stateToChanges: StateToChanges) {}

  public run(lockState: LockState): LockStateChanges {
    const stateChanges = this._stateToChanges.run(lockState.state);

    return new LockStateChanges(stateChanges);
  }
}
