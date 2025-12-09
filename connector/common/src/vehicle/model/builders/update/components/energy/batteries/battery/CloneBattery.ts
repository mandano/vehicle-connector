import Battery from "../../../../../../../components/energy/Battery.ts";
import State from "../../../../../../../State.ts";

export default class CloneBattery {
  public run(battery: Battery): Battery {
    const clonedBattery = new Battery(
      new State<number>(
        battery.level.state,
        battery.level.originatedAt,
        battery.level.updatedAt,
        battery.level.createdAt,
      ),
    );

    if (battery.voltage !== undefined) {
      clonedBattery.voltage = new State<number>(
        battery.voltage.state,
        battery.voltage.originatedAt,
        battery.voltage.updatedAt,
        battery.voltage.createdAt,
      );
    }
    return clonedBattery;
  }
}
