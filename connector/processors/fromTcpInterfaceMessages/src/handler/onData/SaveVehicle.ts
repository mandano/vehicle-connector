import { Imei } from "../../../../../common/src/vehicle/components/iot/network/protocol/Imei.ts";
import { Unknown } from "../../../../../common/src/vehicle/model/models/Unknown.ts";
import VehicleRepositoryInterface from "../../../../../common/src/repositories/VehicleRepositoryInterface.ts";
import { LoggerInterface } from "../../../../../common/src/logger/LoggerInterface.ts";
import { types as modelTypes } from "../../../../../common/src/vehicle/model/models/types.ts";
import { UpdateInterface } from "../../../../../common/src/vehicle/model/builders/update/UpdateInterface.ts";
import ContainsIot from "../../../../../common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../../common/src/vehicle/components/iot/network/ContainsNetwork.ts";

import { SaveVehicleInterface } from "./SaveVehicleInterface.ts";

export class SaveVehicle implements SaveVehicleInterface {
  constructor(
    private readonly _vehicleRepository: VehicleRepositoryInterface,
    private readonly _logger: LoggerInterface,
    private readonly _allowAutomaticVehicleCreation: boolean = true,
    private _update: UpdateInterface,
  ) {}

  public run(model: Unknown, imei: Imei): number | undefined {
    const existingVehicle = this._vehicleRepository.findByImei(imei);

    if (existingVehicle === undefined && !this._allowAutomaticVehicleCreation) {
      this._logger.warn(`Vehicle with IMEI ${imei} not found`);
      return undefined;
    }

    if (existingVehicle === undefined) {
      const vehicleId = this._vehicleRepository.create(model);

      if (vehicleId === undefined) {
        this._logger.warn(`Vehicle not created`);
        return undefined;
      }

      return vehicleId;
    }

    this.update(existingVehicle.model, model);

    return existingVehicle.id;
  }

  //TODO: change to boolean return data type
  private update(toBeUpdated: modelTypes, updateBy: Unknown): void {
    const updatedVehicleModel = this._update.run(toBeUpdated, updateBy);

    if (updatedVehicleModel === undefined) {
      this._logger.warn(`Model not updated`);
      return undefined;
    }

    if (
      ContainsIot.run(updatedVehicleModel) === false ||
      updatedVehicleModel.ioT === undefined
    ) {
      return undefined;
    }

    if (
      ContainsNetwork.run(updatedVehicleModel.ioT) === false ||
      updatedVehicleModel.ioT.network === undefined
    ) {
      return undefined;
    }

    if (!updatedVehicleModel?.ioT.network.containsModules()) {
      this._logger.error("Network does not contain connection modules");
      return undefined;
    }

    if (
      updatedVehicleModel?.ioT.network.connectionModules[0].imei === undefined
    ) {
      this._logger.warn(`IMEI not found in model`);
      return undefined;
    }

    this._vehicleRepository.updateByImei(
      updatedVehicleModel?.ioT.network.connectionModules[0].imei,
      updatedVehicleModel,
    );
  }
}
