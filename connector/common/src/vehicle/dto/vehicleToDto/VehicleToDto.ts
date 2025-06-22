import { Vehicle } from "../../Vehicle.ts";
import { Unknown as UnknownModel } from "../../model/models/Unknown.ts";
import { LockableScooter as LockableScooterModel } from "../../model/models/LockableScooter.ts";
import VehicleDto from "../../VehicleDto.ts";

import ToUnknownDto from "./models/ToUnknownDto.ts";
import ToLockableScooterDto from "./models/ToLockableScooterDto.ts";

export default class VehicleToDto {
  constructor(
    private readonly _unknown: ToUnknownDto,
    private readonly _lockableScooter: ToLockableScooterDto,
  ) {}

  public run(vehicle: Vehicle): VehicleDto | undefined {
    if (vehicle.model instanceof UnknownModel) {
      const model = this._unknown.run(vehicle.model);

      return new VehicleDto(vehicle.id, model, vehicle.createdAt.toISOString());
    }

    if (vehicle.model instanceof LockableScooterModel) {
      const model = this._lockableScooter.run(vehicle.model);

      if (!model) {
        return undefined;
      }

      return new VehicleDto(vehicle.id, model, vehicle.createdAt.toISOString());
    }

    return undefined;
  }
}
