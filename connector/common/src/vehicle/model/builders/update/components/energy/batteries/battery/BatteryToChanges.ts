import Battery from "../../../../../../../components/energy/Battery.ts";
import StateDtoChanges from "../../../../../../../components/state/StateDtoChanges.ts";

import BatteryChanges from "./BatteryChanges.ts";

export default class BatteryToChanges {
  public run(battery: Battery): BatteryChanges {
    // TODO: change battery param order
    const batteryChanges = new BatteryChanges(
      undefined,
      new StateDtoChanges<number>(
        battery.level.state,
        battery.level.originatedAt?.toISOString(),
        battery.level.createdAt.toISOString(),
        battery.level.updatedAt?.toISOString(),
      ),
    );

    if (battery.voltage !== undefined) {
      batteryChanges.voltage = new StateDtoChanges<number>(
        battery.voltage.state,
        battery.voltage.originatedAt?.toISOString(),
        battery.voltage.createdAt.toISOString(),
        battery.voltage.updatedAt?.toISOString(),
      );
    }

    return batteryChanges;
  }
}
