import { LockToMessageLine as v0_1 } from "../../../../simulator/0_1/pakets/lock/toConnector/LockToMessageLine.ts";
import { LockToMessageLine as v0_2 } from "../../../0_2/pakets/lock/toConnector/LockToMessageLine.ts";
import { ID_0_1, ID_0_2 } from "../../../../versions.ts";
import { TransferLock } from "../../../../../../../../connector/common/src/vehicle/actions/TransferLock.ts";

export class CreateMessageLine {
  constructor(
    private readonly _v0_1: v0_1,
    private readonly _v0_2: v0_2,
  ) {}

  public run(lock: TransferLock): string | undefined {
    if (lock.protocolVersion === ID_0_1) {
      return this._v0_1.run(lock);
    }

    if (lock.protocolVersion === ID_0_2) {
      return this._v0_2.run(lock);
    }

    return undefined;
  }
}

export default CreateMessageLine;
