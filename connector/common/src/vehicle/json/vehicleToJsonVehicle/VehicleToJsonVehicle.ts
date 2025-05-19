import { Vehicle } from "../../Vehicle.ts";
import { Unknown as UnknownModel } from "../../model/models/Unknown.ts";
import { JsonVehicle } from "../JsonVehicle.ts";
import { LockableScooter as LockableScooterModel } from "../../model/models/LockableScooter.ts";

import { Unknown } from "./models/Unknown.ts";
import { LockableScooter } from "./models/LockableScooter.ts";

export class VehicleToJsonVehicle {
  constructor(
    private _unknown: Unknown,
    private _lockableScooter: LockableScooter,
  ) {}

  public run(vehicle: Vehicle) {
    if (vehicle.model instanceof UnknownModel) {
      const model = this._unknown.run(vehicle.model);

      return new JsonVehicle(vehicle.id, model, vehicle.createdAt);
    }

    if (vehicle.model instanceof LockableScooterModel) {
      const model = this._lockableScooter.run(vehicle.model);

      return new JsonVehicle(vehicle.id, model, vehicle.createdAt);
    }

    return undefined;
  }
}

export default VehicleToJsonVehicle;
