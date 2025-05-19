import { Batteries } from "../../../../components/energy/Batteries.ts";

import { UpdateState } from "./UpdateState.ts";
import { UpdateEnergyInterface } from "./UpdateEnergyInterface.ts";

export class UpdateEnergy implements UpdateEnergyInterface {
  private _updateState: UpdateState;

  constructor(updateState: UpdateState) {
    this._updateState = updateState;
  }

  public run(toBeUpdated: Batteries, updateBy: Batteries): Batteries {
    if (updateBy.batteries === undefined) {
      return toBeUpdated;
    }

    updateBy.batteries.forEach((battery, idx) => {
      if (toBeUpdated === undefined) {
        toBeUpdated = new Batteries([]);
      }

      if (toBeUpdated.batteries.length === 0) {
        toBeUpdated.batteries = updateBy.batteries ?? [];
        return;
      }

      const newLevel = this._updateState.run(
        toBeUpdated.batteries[idx].level,
        battery.level,
      );

      const newVoltage = this._updateState.run(
        toBeUpdated.batteries[idx].voltage,
        battery.voltage,
      );

      if (newLevel !== undefined) {
        toBeUpdated.batteries[idx].level = newLevel;
      }

      if (newVoltage !== undefined) {
        toBeUpdated.batteries[idx].voltage = newVoltage;
      }
    });

    return toBeUpdated;
  }
}
