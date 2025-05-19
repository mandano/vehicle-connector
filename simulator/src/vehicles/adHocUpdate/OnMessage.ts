import { SimulatedVehicle } from "../SimulatedVehicle.ts";
import { OnMessageInterface } from "../../../../connector/common/src/adapters/queue/OnMessageInterface.ts";

import { AdHocUpdateJsonConverter } from "./AdHocUpdateJsonConverter.ts";

export class OnMessage implements OnMessageInterface {
  private _simulatedVehicles: SimulatedVehicle[];
  private _adHocUpdateJsonConverter: AdHocUpdateJsonConverter;

  constructor(
    simulatedVehicles: SimulatedVehicle[],
    adHocUpdateJsonConverter: AdHocUpdateJsonConverter,
  ) {
    this._simulatedVehicles = simulatedVehicles;
    this._adHocUpdateJsonConverter = adHocUpdateJsonConverter;
  }

  public async run(message: string): Promise<void> {
    const adHocUpdate = this._adHocUpdateJsonConverter.fromJson(message);

    if (adHocUpdate === undefined) {
      return;
    }

    const vehicleId = adHocUpdate.vehicleId;
    const vehicle = this._simulatedVehicles.find(
      (vehicle) => vehicle.vehicle.id === vehicleId,
    );

    if (vehicle === undefined) {
      return;
    }

    await vehicle.publishAdHocMessageLine(adHocUpdate);
  }
}
