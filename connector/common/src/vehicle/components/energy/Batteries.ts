import { Battery } from "./Battery.ts";
import { EnergyComponentsInterface } from "./EnergyComponentsInterface.ts";

export class Batteries implements EnergyComponentsInterface {
  private _batteries: Battery[] = [];

  constructor(batteries: Battery[]) {
    this._batteries = batteries;
  }

  get batteries(): Battery[] {
    return this._batteries;
  }

  set batteries(batteries: Battery[]) {
    this._batteries = batteries;
  }

  public getAvgLevel(): number {
    let levelSum = 0;
    for (const battery of this.batteries) {
      levelSum += battery.level.state;
    }

    return levelSum / this.batteries.length;
  }

  public getAvgLevelRounded(): number {
    return Math.round(this.getAvgLevel());
  }

  public latestOriginateAt() {
    const neverUpdated = new Date(0);
    let latest = neverUpdated;
    for (const battery of this.batteries) {
      if (
        battery.level.originatedAt !== undefined &&
        battery.level.originatedAt > latest
      ) {
        latest = battery.level.originatedAt;
      }
    }

    if (latest === neverUpdated) {
      return undefined;
    }

    return latest;
  }
}
