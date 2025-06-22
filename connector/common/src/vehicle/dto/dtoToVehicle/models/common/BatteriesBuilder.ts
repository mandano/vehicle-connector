import Batteries from "../../../../components/energy/Batteries.ts";
import BatteriesDto from "../../../../components/energy/BatteriesDto.ts";
import Battery from "../../../../components/energy/Battery.ts";
import State from "../../../../State.ts";

import SetState from "./SetState.ts";

export default class BatteriesBuilder {
  constructor(private readonly _setState: SetState) {}

  public build(batteriesDto: BatteriesDto): Batteries {
    const batteries = new Batteries([]);

    for (const battery of batteriesDto.batteries) {
      let voltage: State<number> | undefined = undefined;

      if (battery.voltage !== undefined) {
        voltage = this._setState.run(battery.voltage);
      }

      const level = this._setState.run<number>(battery.level);
      if (level === undefined) {
        continue;
      }

      batteries.batteries.push(
        new Battery(level, voltage),
      );
    }

    return batteries;
  }
}
