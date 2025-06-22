import StateDto from "../state/StateDto.ts";

import Lock from "./LockState.ts";

export default class LockStateDto {
  constructor(
    public state: StateDto<typeof Lock.LOCKED | typeof Lock.UNLOCKED>,
  ) {}
}
