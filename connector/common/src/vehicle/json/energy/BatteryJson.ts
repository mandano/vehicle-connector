import { StateJson } from "../StateJson.ts";

import { EnergyComponentInterface } from "./EnergyComponentInterface.ts";

export class BatteryJson implements EnergyComponentInterface {
  public readonly voltage?: StateJson<number>;
  public readonly level: StateJson<number>;

  constructor(level: StateJson<number>, voltage?: StateJson<number>) {
    this.voltage = voltage;
    this.level = level;
  }
}
