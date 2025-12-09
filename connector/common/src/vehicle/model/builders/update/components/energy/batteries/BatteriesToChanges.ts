import Batteries from "../../../../../../components/energy/Batteries.ts";
import StateDtoChanges from "../../../../../../components/state/StateDtoChanges.ts";

import BatteriesChanges from "./BatteriesChanges.ts";
import BatteryChanges from "./battery/BatteryChanges.ts";
import BatteryChangesByIdx from "./battery/BatteryChangesByIdx.ts";

export default class BatteriesToChanges {
  public run(batteries: Batteries): BatteriesChanges {
    const batteriesChanges = batteries.batteries.map((battery) => {
      return new BatteryChanges(
        new StateDtoChanges<number>(
          battery.level.state,
          battery.level.originatedAt?.toISOString(),
          battery.level.updatedAt?.toISOString(),
          battery.level.createdAt.toISOString(),
        ),
      );
    });

    const batteriesChangesByIdx: BatteryChangesByIdx[] = [];

    batteriesChanges.forEach((batteryChanges, idx) => {
      batteriesChangesByIdx.push(new BatteryChangesByIdx(batteryChanges, idx));
    })

    return new BatteriesChanges(batteriesChangesByIdx);
  }
}
