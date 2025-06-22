import { State } from "../../State.ts";

export class LockState {
  public static LOCKED = "locked";
  public static UNLOCKED = "unlocked";

  constructor(
    private _state: State<typeof LockState.LOCKED | typeof LockState.UNLOCKED>,
  ) {}

  get state(): State<typeof LockState.LOCKED | typeof LockState.UNLOCKED> {
    return this._state;
  }

  set state(state: State<typeof LockState.LOCKED | typeof LockState.UNLOCKED>) {
    this._state = state;
  }
}

export default LockState;
