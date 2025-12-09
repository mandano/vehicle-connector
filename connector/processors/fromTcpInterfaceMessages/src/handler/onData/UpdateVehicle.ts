import VehicleRepositoryHashableInterface from "common/src/repositories/vehicle/VehicleRepositoryHashableInterface.ts";
import PublishChanges from "common/src/vehicle/model/builders/update/publish/PublishChanges.ts";

import { Unknown } from "../../../../../common/src/vehicle/model/models/Unknown.ts";
import { LoggerInterface } from "../../../../../common/src/logger/LoggerInterface.ts";
import UpdateInterface from "../../../../../common/src/vehicle/model/builders/update/UpdateInterface.ts";
import { types as modelTypes } from "../../../../../../connector/common/src/vehicle/model/models/types.ts";
import ContainsIot from "../../../../../common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../../common/src/vehicle/components/iot/network/ContainsNetwork.ts";

export class UpdateVehicle {
  constructor(
    private readonly _vehicleRepository: VehicleRepositoryHashableInterface,
    private readonly _logger: LoggerInterface,
    private readonly _update: UpdateInterface,
    private readonly _publishChanges: PublishChanges,
  ) {}

  public async run(
    updateBy: Unknown,
    toBeUpdated: modelTypes,
    validationHash: string,
  ): Promise<boolean> {
    const updateResult = this._update.run(toBeUpdated, updateBy);

    if (updateResult === undefined) {
      this._logger.error(`Model not updated`);
      return false;
    }

    if (
      ContainsIot.run(updateResult.model) === false ||
      updateResult.model.ioT === undefined
    ) {
      this._logger.error(`Model does not contain IoT.`);
      return false;
    }

    if (
      ContainsNetwork.run(updateResult.model.ioT) === false ||
      updateResult.model.ioT.network === undefined
    ) {
      this._logger.error(`Model does not contain network.`);
      return false;
    }

    if (!updateResult?.model.ioT.network.containsModules()) {
      this._logger.error("Network does not contain connection modules.");
      return false;
    }

    if (
      updateResult?.model.ioT.network.connectionModules[0].imei === undefined
    ) {
      this._logger.warn(`IMEI not found in model`);
      return false;
    }

    if (updateResult?.changes !== undefined) {
      await this._publishChanges.run(updateResult.changes);
    }

    return await this._vehicleRepository.updateByImei(
      updateResult.model.ioT.network.connectionModules[0].imei,
      updateResult.model,
      validationHash,
    );
  }
}

export default UpdateVehicle;
