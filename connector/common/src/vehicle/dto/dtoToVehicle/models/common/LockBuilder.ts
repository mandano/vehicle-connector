import LockStateDto from "../../../../components/lock/LockStateDto.ts";
import LockState from "../../../../components/lock/LockState.ts";

import SetState from "./SetState.ts";

export default class LockBuilder {
  constructor(private readonly _setState: SetState) {}

  public build(lock: LockStateDto): LockState | undefined {
    if (
      typeof lock !== "object" ||
      lock === null ||
      !("state" in lock) ||
      lock.state === undefined
    ) {
      return undefined;
    }

    const state = this._setState.run<
      typeof LockState.LOCKED | typeof LockState.UNLOCKED
    >(lock.state);

    if (state === undefined) {
      return undefined;
    }

    return new LockState(state);
  }
}
