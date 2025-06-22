import Vehicle from "../../Vehicle.ts";
import VehicleDto from "../../VehicleDto.ts";
import UnknownDto from "../../model/models/UnknownDto.ts";
import LockableScooterDto from "../../model/models/LockableScooterDto.ts";

import FromLockableScooterDto from "./models/FromLockableScooterDto.ts";
import FromUnknownDto from "./models/FromUnknownDto.ts";

export default class DtoToVehicle {
  constructor(
    private _lockableScooter: FromLockableScooterDto,
    private _unknown: FromUnknownDto,
  ) {}

  public run(vehicleDto: VehicleDto): Vehicle | undefined {
    if (vehicleDto.model instanceof UnknownDto) {
      const unknown = this._unknown.run(vehicleDto.model);

      return new Vehicle(
        vehicleDto.id,
        unknown,
        new Date(vehicleDto.createdAt),
      );
    }

    if (vehicleDto.model instanceof LockableScooterDto) {
      const lockableScooter = this._lockableScooter.run(vehicleDto.model);

      return new Vehicle(
        vehicleDto.id,
        lockableScooter,
        new Date(vehicleDto.createdAt),
      );
    }

    return undefined;
  }
}
