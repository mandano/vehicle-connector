import IsStringStateDto from "../state/IsStringStateDto.ts";

import LockState from "./LockState.ts";
import LockStateDto from "./LockStateDto.ts";

export default class IsLockStateDto {
  constructor(private readonly _isStringStateDto: IsStringStateDto) {}

  public run(obj: unknown): obj is LockStateDto {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    if (!("state" in obj)) return false;

    const isStringStateDto = this._isStringStateDto.run(obj.state);
    const isLockString =
      (obj as LockStateDto).state.state === LockState.LOCKED ||
      (obj as LockStateDto).state.state === LockState.UNLOCKED;

    return isStringStateDto && isLockString;
  }
}
