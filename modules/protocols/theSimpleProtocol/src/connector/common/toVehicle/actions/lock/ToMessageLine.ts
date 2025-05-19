import CreateMessageLinev0_1 from "../../../../0_1/pakets/lock/toVehicle/CreateMessageLine.ts";
import CreateMessageLinev0_2 from "../../../../../connector/0_2/pakets/lock/toVehicle/CreateMessageLine.ts";
import { ID_0_1, ID_0_2 } from "../../../../../versions.ts";
import { TransferLock } from "../../../../../../../../../connector/common/src/vehicle/actions/TransferLock.ts";

class ToMessageLine {
  constructor(
    private _v0_1: CreateMessageLinev0_1,
    private _v0_2: CreateMessageLinev0_2,
  ) {}

  public run(action: TransferLock): string | undefined {
    if (action.protocolVersion === ID_0_1) {
      return this._v0_1.run(action);
    }

    if (action.protocolVersion === ID_0_2) {
      return this._v0_2.run(action);
    }

    return undefined;
  }
}

export default ToMessageLine;
