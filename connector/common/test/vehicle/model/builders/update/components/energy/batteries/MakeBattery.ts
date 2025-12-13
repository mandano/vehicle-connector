import State from "../../../../../../../../src/vehicle/State.ts";
import Battery from "../../../../../../../../src/vehicle/components/energy/Battery.ts";

export default class MakeBattery {
  public run(
    level: number,
    levelOriginatedAt?: Date,
    voltage?: number,
    voltageOriginatedAt?: Date,
  ): Battery {
    const lvl = new State<number>(level, levelOriginatedAt);
    const volt =
      voltage !== undefined
        ? new State<number>(voltage, voltageOriginatedAt)
        : undefined;
    return new Battery(lvl, volt);
  }
}
