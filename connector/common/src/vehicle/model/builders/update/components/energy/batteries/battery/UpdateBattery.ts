import UpdateStateNoUndefined from "../../../state/noUndefined/UpdateStateNoUndefined.ts";
import Battery from "../../../../../../../components/energy/Battery.ts";

import UpdateBatteryResult from "./UpdateBatteryResult.ts";
import UpdateVoltage from "./voltage/UpdateVoltage.ts";
import BatteryChanges from "./BatteryChanges.ts";
import BatteryToChanges from "./BatteryToChanges.ts";

export default class UpdateBattery {
  constructor(
    private _updateState: UpdateStateNoUndefined,
    private _updateVoltage: UpdateVoltage,
    private _batteryToChanges: BatteryToChanges,
  ) {}

  public run(
    toBeUpdated: Battery | undefined,
    updateBy: Battery,
  ): UpdateBatteryResult {
    if (toBeUpdated === undefined) {
      return new UpdateBatteryResult(
        updateBy,
        this._batteryToChanges.run(updateBy),
      );
    }

    const newLevelResult = this._updateState.run<number>(
      toBeUpdated.level,
      updateBy.level,
    );

    const newVoltageResult = this._updateVoltage.run(
      toBeUpdated.voltage,
      updateBy.voltage,
    );

    const battery = new Battery(newLevelResult.new, newVoltageResult.new);

    return new UpdateBatteryResult(
      battery,
      new BatteryChanges(newVoltageResult.changes, newLevelResult.changes),
    );
  }
}
