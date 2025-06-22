import LockStateDto from "../../../components/lock/LockStateDto.ts";
import LockState from "../../../components/lock/LockState.ts";
import IsLockStateDto from "../../../components/lock/IsLockStateDto.ts";

import SetStateDto from "./SetStateDto.ts";

export default class LockBuilder {
  constructor(
    private readonly _setStateDto: SetStateDto,
    private readonly _isLockStateDto: IsLockStateDto,
  ) {}

  public build(lock: unknown): LockStateDto | undefined {
    if (typeof lock !== "object" || lock === null) {
      return undefined;
    }

    if (this._isLockStateDto.run(lock) === false) {
      return undefined;
    }

    const stateDto = this._setStateDto.run<
      typeof LockState.LOCKED | typeof LockState.UNLOCKED
    >(lock.state);

    if (stateDto === undefined) {
      return undefined;
    }

    return new LockStateDto(stateDto);
  }
}
