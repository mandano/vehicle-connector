import { State } from "../../State.ts";

export class LockState {
  public static LOCKED = "locked";
  public static UNLOCKED = "unlocked";

  /**
  public static isLockState(obj: unknown): obj is LockState {
    return (
      (obj as LockState).state !== undefined &&
      State.isState((obj as LockState).state) &&
      (
        (obj as LockState).state.state === LockState.LOCKED ||
        (obj as LockState).state.state === LockState.UNLOCKED
      )
    );
  }*/

  constructor(
    private _state: State<typeof LockState.LOCKED | typeof LockState.UNLOCKED>,
  ) {}

  get state(): State<typeof LockState.LOCKED | typeof LockState.UNLOCKED> {
    return this._state;
  }
}

export default LockState;
