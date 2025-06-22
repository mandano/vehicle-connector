import VehicleRepositoryHashableInterface from "common/src/repositories/vehicle/VehicleRepositoryHashableInterface.ts";

import { Unknown } from "../../../../../common/src/vehicle/model/models/Unknown.ts";
import { LoggerInterface } from "../../../../../common/src/logger/LoggerInterface.ts";
import { UpdateInterface } from "../../../../../common/src/vehicle/model/builders/update/UpdateInterface.ts";
import { types as modelTypes } from "../../../../../../connector/common/src/vehicle/model/models/types.ts";
import ContainsIot from "../../../../../common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../../common/src/vehicle/components/iot/network/ContainsNetwork.ts";

export class UpdateVehicle {
  constructor(
    private readonly _vehicleRepository: VehicleRepositoryHashableInterface,
    private readonly _logger: LoggerInterface,
    private readonly _update: UpdateInterface,
  ) {}

  public async run(updateBy: Unknown, toBeUpdated: modelTypes, validationHash: string): Promise<boolean> {
    const updatedVehicleModel = this._update.run(toBeUpdated, updateBy);

    if (updatedVehicleModel === undefined) {
      this._logger.warn(`Model not updated`);
      return false;
    }

    if (
      ContainsIot.run(updatedVehicleModel) === false ||
      updatedVehicleModel.ioT === undefined
    ) {
      return false;
    }

    if (
      ContainsNetwork.run(updatedVehicleModel.ioT) === false ||
      updatedVehicleModel.ioT.network === undefined
    ) {
      return false;
    }

    if (!updatedVehicleModel?.ioT.network.containsModules()) {
      this._logger.error("Network does not contain connection modules");
      return false;
    }

    if (
      updatedVehicleModel?.ioT.network.connectionModules[0].imei === undefined
    ) {
      this._logger.warn(`IMEI not found in model`);
      return false;
    }

    return await this._vehicleRepository.updateByImei(
      updatedVehicleModel?.ioT.network.connectionModules[0].imei,
      updatedVehicleModel,
      validationHash,
    );
  }
}
