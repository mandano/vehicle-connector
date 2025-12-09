import Batteries from "../../../../../../components/energy/Batteries.ts";

import CloneBattery from "./battery/CloneBattery.ts";

export default class CloneBatteries {
  constructor(private _cloneBattery: CloneBattery) {}

  public run(batteries: Batteries): Batteries {
    const clonedBatteries: Batteries = new Batteries([]);

    batteries.batteries.forEach((battery) => {
      clonedBatteries.batteries.push(this._cloneBattery.run(battery));
    });

    return clonedBatteries;
  }
}
