import ContainsIot from "common/src/vehicle/components/iot/ContainsIot.ts";
import LoggerInterface from "common/src/logger/LoggerInterface.ts";

import { SimulatedVehicle } from "./SimulatedVehicle.ts";

export default class ChangeModelType {
  private readonly _defaultModelType = "LockableScooter";

  constructor(private _logger: LoggerInterface) {}

  public async run(vehicle: SimulatedVehicle): Promise<boolean> {
    if (
      !ContainsIot.run(vehicle.vehicle.model) ||
      vehicle.vehicle.model.ioT === undefined
    ) {
      this._logger.error(`Vehicle does not contain IoT ${vehicle.vehicle.id}`);

      return false;
    }

    return await vehicle.vehicleUserApiActions.updateModelName(
      this._defaultModelType,
    );
  }
}
