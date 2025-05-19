import Vehicle from "../../../../../../../../connector/common/src/vehicle/Vehicle.ts";
import LockableScooter from "../../../../../../../../connector/common/src/vehicle/model/models/LockableScooter.ts";

import ToMessageLineLockableScooter from "./lockableScooter/ToMessageLine.ts";

export class ToMessageLine {
  constructor(
    private _lockableScooter: ToMessageLineLockableScooter,
  ) {}

  public run(vehicle: Vehicle): string | undefined {
    if (vehicle.model instanceof LockableScooter) {
      return this._lockableScooter.run(vehicle.model);
    }

    return undefined;
  }
}

export default ToMessageLine;
