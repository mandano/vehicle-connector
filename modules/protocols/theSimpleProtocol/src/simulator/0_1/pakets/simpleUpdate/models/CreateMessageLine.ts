import { Vehicle } from "../../../../../../../../../connector/common/src/vehicle/Vehicle.ts";
import { LockableScooter } from "../../../../../../../../../connector/common/src/vehicle/model/models/LockableScooter.ts";

import CreateMessageLineLockableScooter from "./lockableScooter/CreateMessageLine.ts";

class CreateMessageLine {
  constructor(
    private _createMessageLineLockableScooter: CreateMessageLineLockableScooter,
  ) {}

  public run(vehicle: Vehicle): string | undefined {
    if (vehicle.model instanceof LockableScooter) {
      return this._createMessageLineLockableScooter.run(vehicle.model);
    }

    return undefined;
  }
}

export default CreateMessageLine;
