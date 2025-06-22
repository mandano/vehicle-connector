import VehicleRepositoryHashableInterface from "common/src/repositories/vehicle/VehicleRepositoryHashableInterface.ts";

import { Imei } from "../../../../../common/src/vehicle/components/iot/network/protocol/Imei.ts";
import { Unknown } from "../../../../../common/src/vehicle/model/models/Unknown.ts";
import { LoggerInterface } from "../../../../../common/src/logger/LoggerInterface.ts";
import { types as modelTypes } from "../../../../../common/src/vehicle/model/models/types.ts";
import { UpdateInterface } from "../../../../../common/src/vehicle/model/builders/update/UpdateInterface.ts";
import ContainsIot from "../../../../../common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../../common/src/vehicle/components/iot/network/ContainsNetwork.ts";

import { SaveVehicleInterface } from "./SaveVehicleInterface.ts";

export class SaveVehicle implements SaveVehicleInterface {
  constructor(
    private readonly _vehicleRepository: VehicleRepositoryHashableInterface,
    private readonly _logger: LoggerInterface,
    private readonly _allowAutomaticVehicleCreation: boolean = true,
    private readonly _update: UpdateInterface,
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

    const updated = await this.update(existingVehicle.model, model, hashable.hash);

    if (updated !== true) {
      this._logger.warn(`Vehicle not updated`);
      return undefined;
    }

    return existingVehicle.id;
  }

  //TODO: change to boolean return data type
  private async update(
    toBeUpdated: modelTypes,
    updateBy: Unknown,
    validationHash: string,
  ): Promise<boolean | undefined> {
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

    return await this._vehicleRepository.updateByImei(
      updatedVehicleModel?.ioT.network.connectionModules[0].imei,
      updatedVehicleModel,
      validationHash,
    );
  }
}
