import { CreateLock as BuildFromMessageLineLock } from "../../../../../connector/0_1/pakets/lock/fromVehicle/CreateLock.ts";
import { Lock } from "../../../../../connector/0_1/pakets/lock/Lock.ts";

export class CreatePaket {
  constructor(
    private _buildFromMessageLineLock: BuildFromMessageLineLock,
  ) {}

  public run(messageLine: string): Lock | undefined {
    const lock =
      this._buildFromMessageLineLock.run(messageLine);

    if (lock === undefined) {
      return undefined;
    }

    return lock;
  }
}
