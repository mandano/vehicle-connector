import { Vehicle } from "../../Vehicle.ts";
import { JsonVehicle } from "../JsonVehicle.ts";
import { Unknown as UnknownModel } from "../../model/models/Unknown.ts";

import { Unknown } from "./models/Unknown.ts";
import { LockableScooter } from "./models/LockableScooter.ts";

export class JsonVehicleToVehicle {
  private _lockableScooter: LockableScooter;
  private _unknown: Unknown;

  constructor(
    lockableScooter: LockableScooter,
    unknown: Unknown,
  ) {
    this._lockableScooter = lockableScooter;
    this._unknown = unknown;
  }

  public run(vehicle: JsonVehicle): Vehicle | undefined {
    const modelName = vehicle.model.modelName;

    if (modelName === undefined) {
      return undefined;
    }

    if (modelName === UnknownModel.name) {
      const unknown = this._unknown.run(vehicle.model);

      return new Vehicle(vehicle.id, unknown, vehicle.createdAt);
    }

    if (modelName === LockableScooter.name) {
      const lockableScooter = this._lockableScooter.run(vehicle.model);

      return new Vehicle(vehicle.id, lockableScooter, vehicle.createdAt);
    }

    return undefined;
  }
}

export default JsonVehicleToVehicle;
