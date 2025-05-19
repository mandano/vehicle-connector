import { JsonVehicleModel } from "../../JsonVehicleModel.ts";
import { Unknown as UnknownModel } from "../../../model/models/Unknown.ts";
import { JsonIoT } from "../../iot/JsonIoT.ts";

import { NetworkBuilder } from "./unknown/NetworkBuilder.ts";
import { PositionBuilder } from "./unknown/PositionBuilder.ts";
import { EnergyBuilder } from "./unknown/EnergyBuilder.ts";

export class Unknown {
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

  public run(model: UnknownModel): JsonVehicleModel {
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

    return new JsonVehicleModel(Unknown.name, energyJson, jsonIoT);
  }
}

export default Unknown;
