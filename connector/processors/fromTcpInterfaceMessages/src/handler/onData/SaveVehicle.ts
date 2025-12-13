import VehicleRepositoryHashableInterface from "common/src/repositories/vehicle/VehicleRepositoryHashableInterface.ts";

import { Imei } from "../../../../../common/src/vehicle/components/iot/network/protocol/Imei.ts";
import { Unknown } from "../../../../../common/src/vehicle/model/models/Unknown.ts";
import { LoggerInterface } from "../../../../../common/src/logger/LoggerInterface.ts";

import { SaveVehicleInterface } from "./SaveVehicleInterface.ts";
import UpdateVehicle from "./UpdateVehicle.ts";

export class SaveVehicle implements SaveVehicleInterface {
  constructor(
    private readonly _vehicleRepository: VehicleRepositoryHashableInterface,
    private readonly _logger: LoggerInterface,
    private readonly _allowAutomaticVehicleCreation: boolean = true,
    private readonly _updateVehicle: UpdateVehicle,
  ) {}

  public async run(model: Unknown, imei: Imei): Promise<number | undefined> {
    const hashable = await this._vehicleRepository.findByImei(imei);

    if (hashable === undefined && !this._allowAutomaticVehicleCreation) {
      this._logger.warn(`Vehicle with IMEI ${imei} not found`);
      return undefined;
    }

    if (hashable === undefined) {
      const vehicleId = await this._vehicleRepository.create(model);

      if (vehicleId === undefined) {
        this._logger.warn(`Vehicle not created`);
        return undefined;
      }

      return vehicleId;
    }

    const existingVehicle = hashable.value;

    const updated = await this._updateVehicle.run(
      model,
      existingVehicle.model,
      hashable.hash,
    );

    if (updated === false) {
      this._logger.warn(`Vehicle not updated`);
      return undefined;
    }

    return existingVehicle.id;
  }
}
