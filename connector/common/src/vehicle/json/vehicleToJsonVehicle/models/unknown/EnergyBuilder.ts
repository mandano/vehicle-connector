import { BatteryJson } from "../../../energy/BatteryJson.ts";
import { StateJson } from "../../../StateJson.ts";
import { Batteries } from "../../../../components/energy/Batteries.ts";
import { EnergyJson } from "../../../energy/EnergyJson.ts";

export class EnergyBuilder {
  public build(energy: Batteries) {
    const batteriesJson: BatteryJson[] = [];

    const batteries = energy.batteries;

    for (const battery of batteries) {
      let voltage: StateJson<number> | undefined = undefined;

      if (battery.voltage !== undefined) {
        voltage = new StateJson(
          battery.voltage.state,
          battery.voltage.originatedAt?.toISOString(),
          battery.voltage.updatedAt,
          battery.voltage.createdAt,
        );
      }

      batteriesJson.push(
        new BatteryJson(
          new StateJson(
            battery.level.state,
            battery.level.originatedAt?.toISOString(),
            battery.level.updatedAt,
            battery.level.createdAt,
          ),
          voltage,
        ),
      );
    }

    return new EnergyJson(batteriesJson);
  }
}

export default EnergyBuilder;

