import { typeNames as vehicleModelTypeNames } from "../model/models/types.ts";

import { EnergyJson } from "./energy/EnergyJson.ts";
import { JsonIoT } from "./iot/JsonIoT.ts";
import { JsonLock } from "./JsonLock.ts";
import { JsonSpeedometer } from "./JsonSpeedometer.ts";

export class JsonVehicleModel {
  public modelName: vehicleModelTypeNames;
  public energy?: EnergyJson;
  public ioT?: JsonIoT;
  public lock?: JsonLock;
  public speedometer?: JsonSpeedometer;

  constructor(
    modelName: vehicleModelTypeNames,
    energy?: EnergyJson,
    ioT?: JsonIoT,
    lock?: JsonLock,
    speedometer?: JsonSpeedometer,
  ) {
    this.modelName = modelName;
    this.energy = energy;
    this.ioT = ioT;
    this.lock = lock;
    this.speedometer = speedometer;
  }
}
