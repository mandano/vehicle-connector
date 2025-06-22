import VehicleDto from "../../VehicleDto.ts";
import IsVehicleDto from "../../IsVehicleDto.ts";
import ModelDto from "../../model/ModelDto.ts";
import VehicleStorageObject from "../../VehicleStorageObject.ts";

import ToUnknownDto from "./ToUnknownDto.ts";
import ToLockableScooterDto from "./ToLockableScooterDto.ts";

export default class ObjectToDto {
  constructor(
    private readonly _unknown: ToUnknownDto,
    private readonly _lockableScooter: ToLockableScooterDto,
  ) {}

  public run(vehicle: VehicleStorageObject): VehicleDto | undefined {
    if (!IsVehicleDto.run(vehicle)) {
      return undefined;
    }

    let model: ModelDto | undefined;

    if (vehicle.model.modelName === "Unknown") {
      model = this._unknown.run(vehicle.model);

      if (!model) {
        return undefined;
      }

      return new VehicleDto(vehicle.id, model, vehicle.createdAt);
    }

    if (vehicle.model.modelName === "LockableScooter") {
      model = this._lockableScooter.run(vehicle.model);

      if (!model) {
        return undefined;
      }

      return new VehicleDto(vehicle.id, model, vehicle.createdAt);
    }
  }
}
