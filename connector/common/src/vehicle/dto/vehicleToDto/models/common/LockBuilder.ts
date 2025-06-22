import { Lock } from "../../../../components/lock/Lock.ts";
import LockStateDto from "../../../../components/lock/LockStateDto.ts";
import LockState from "../../../../components/lock/LockState.ts";

import SetStateDto from "./SetStateDto.ts";

export default class LockBuilder {
  constructor(private readonly _setStateDto: SetStateDto) {}

  public build(lock: Lock): LockStateDto | undefined {
    if (lock.state === undefined) {
      return undefined;
    }

    const stateDto = this._setStateDto.run<
      typeof LockState.LOCKED | typeof LockState.UNLOCKED
    >(lock.state.state);

    return new LockStateDto(stateDto);
  }
}
