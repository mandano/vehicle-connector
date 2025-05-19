import { TransferLock } from "../../../../../../../../../connector/common/src/vehicle/actions/TransferLock.ts";

import { BuildMessageLineLockInterface } from "./BuildMessageLineLockInterface.ts";

export class LockToMessageLine {
  constructor(
    private readonly _buildMessageLine: BuildMessageLineLockInterface,
  ) {}

  public run(lock: TransferLock): string | undefined {
    return this._buildMessageLine.run(lock, lock.imei);
  }
}
