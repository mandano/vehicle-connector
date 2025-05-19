import { BatteryJson } from "./BatteryJson.ts";

export class EnergyJson {
  public batteries: BatteryJson[];

  constructor(batteries: BatteryJson[]) {
    this.batteries = batteries;
  }
}
