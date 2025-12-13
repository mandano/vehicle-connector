import Batteries from "../../../../../../components/energy/Batteries.ts";
import UpdateEnergyInterface from "../../UpdateEnergyInterface.ts";
import UpdateBatteriesResult from "./UpdateBatteriesResult.ts";

import BatteriesChanges from "./BatteriesChanges.ts";
import UpdateBattery from "./battery/UpdateBattery.ts";
import CloneBatteries from "./CloneBatteries.ts";
import BatteriesToChanges from "./BatteriesToChanges.ts";
import BatteryChangesByIdx from "./battery/BatteryChangesByIdx.ts";

/**
 * Batteries are matched by position.
 */
export default class UpdateBatteries implements UpdateEnergyInterface {
  constructor(
    private _updateBattery: UpdateBattery,
    private _cloneBatteries: CloneBatteries,
    private _batteriesToChanges: BatteriesToChanges,
  ) {}

  public run(
    toBeUpdated: Batteries | undefined,
    updateBy: Batteries | undefined,
  ): UpdateBatteriesResult {
    if (toBeUpdated === undefined && updateBy === undefined) {
      return new UpdateBatteriesResult(undefined, undefined);
    }

    if (toBeUpdated === undefined) {
      return new UpdateBatteriesResult(
        this._cloneBatteries.run(updateBy!),
        this._batteriesToChanges.run(updateBy!),
      );
    }

    if (updateBy === undefined) {
      return new UpdateBatteriesResult(
        this._cloneBatteries.run(toBeUpdated!),
        this._batteriesToChanges.run(toBeUpdated),
      );
    }

    const batteriesChangesWithIdx: BatteryChangesByIdx[] = [];
    updateBy.batteries.forEach((battery, idx) => {
      const updateBatteryResult = this._updateBattery.run(
        toBeUpdated.batteries[idx] ?? undefined,
        battery,
      );

      if (updateBatteryResult.new !== undefined) {
        toBeUpdated.batteries[idx] = updateBatteryResult.new;
      }

      if (updateBatteryResult.changes !== undefined) {
        batteriesChangesWithIdx.push(
          new BatteryChangesByIdx(updateBatteryResult.changes, idx),
        );
      }
    });

    const batteriesChanges =
      batteriesChangesWithIdx.length > 0
        ? new BatteriesChanges(batteriesChangesWithIdx)
        : undefined;

    return new UpdateBatteriesResult(toBeUpdated, batteriesChanges);
  }
}
