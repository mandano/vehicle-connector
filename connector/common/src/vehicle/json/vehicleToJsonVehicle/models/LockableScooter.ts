import { JsonVehicleModel } from "../../JsonVehicleModel.ts";
import { LockableScooter as LockableScooterModel } from "../../../model/models/LockableScooter.ts";
import { JsonIoT } from "../../iot/JsonIoT.ts";
import { JsonLock } from "../../JsonLock.ts";
import { JsonSpeedometer } from "../../JsonSpeedometer.ts";

import { NetworkBuilder } from "./unknown/NetworkBuilder.ts";
import { PositionBuilder } from "./unknown/PositionBuilder.ts";
import { EnergyBuilder } from "./unknown/EnergyBuilder.ts";

export class LockableScooter {
  private _networkBuilder: NetworkBuilder;
  private _positionBuilder: PositionBuilder;
  private _energyBuilder: EnergyBuilder;

  constructor(
    networkBuilder: NetworkBuilder,
    positionBuilder: PositionBuilder,
    energyBuilder: EnergyBuilder,
  ) {
    this._networkBuilder = networkBuilder;
    this._positionBuilder = positionBuilder;
    this._energyBuilder = energyBuilder;
  }

  public run(model: LockableScooterModel): JsonVehicleModel {
    let energyJson = undefined;

    if (model.batteries) {
      energyJson = this._energyBuilder.build(model.batteries);
    }

    let jsonIoT = undefined;

    if (model.ioT) {
      let jsonPosition = undefined;

      if (model.ioT.position) {
        jsonPosition = this._positionBuilder.build(model.ioT.position);
      }

      let jsonNetwork = undefined;

      if (model.ioT.network) {
        jsonNetwork = this._networkBuilder.build(model.ioT.network);
      }

      jsonIoT = new JsonIoT(jsonNetwork, jsonPosition);
    }

    let jsonLock = undefined;

    if (model.lock !== undefined && model.lock.state !== undefined) {
      jsonLock = new JsonLock(model.lock.state);
    }

    let jsonSpeedometer = undefined;

    if (model.speedometer !== undefined) {
      jsonSpeedometer = new JsonSpeedometer(model.speedometer.state);
    }

    return new JsonVehicleModel(
      LockableScooter.name,
      energyJson,
      jsonIoT,
      jsonLock,
      jsonSpeedometer,
    );
  }
}

export default LockableScooter;
