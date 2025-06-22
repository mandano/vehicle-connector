import VehicleDto from "../../VehicleDto.ts";
import UnknownDto from "../../model/models/UnknownDto.ts";
import LockableScooterDto from "../../model/models/LockableScooterDto.ts";
import VehicleStorageObject from "../../VehicleStorageObject.ts";

// TODO: rename class
export default class DtoToObject {
  public run(vehicleDto: VehicleDto): VehicleStorageObject {
    const model = {
      ...vehicleDto.model,
      modelName: ""
    };

    // TODO: move to dedicated class
    if (vehicleDto.model instanceof UnknownDto) {
      model.modelName = "Unknown";
    }

    // TODO: move to dedicated class
    if (vehicleDto.model instanceof LockableScooterDto) {
      model.modelName = "LockableScooter";
    }

    return {
      id: vehicleDto.id,
      model: model,
      createdAt: vehicleDto.createdAt
    };
  }
}
