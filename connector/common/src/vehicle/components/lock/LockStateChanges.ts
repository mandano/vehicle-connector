import StateDtoChanges from "../state/StateDtoChanges.ts";

import LockState from "./LockState.ts";

export default class LockStateChanges {
  constructor(
    public state?: StateDtoChanges<
      typeof LockState.LOCKED | typeof LockState.UNLOCKED
    >,
  ) {}
}
