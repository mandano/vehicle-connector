import Battery from "../../../../../../../components/energy/Battery.ts";

import BatteryChanges from "./BatteryChanges.ts";

export default class UpdateBatteryResult {
  constructor(
    private readonly _new: Battery,
    private readonly _changes: BatteryChanges | undefined,
  ) {}

  get new(): Battery {
    return this._new;
  }

  get changes(): BatteryChanges | undefined {
    return this._changes;
  }
}
