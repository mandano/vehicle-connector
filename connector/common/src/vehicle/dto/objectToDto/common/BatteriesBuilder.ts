import BatteriesDto from "../../../components/energy/BatteriesDto.ts";
import StateDto from "../../../components/state/StateDto.ts";
import BatteryDto from "../../../components/energy/BatteryDto.ts";
import IsBatteriesDto from "../../../components/energy/IsBatteriesDto.ts";
import IsBatteryDto from "../../../components/energy/IsBatteryDto.ts";

import SetStateDto from "./SetStateDto.ts";

export default class BatteriesBuilder {
  constructor(
    private readonly _setStateDto: SetStateDto,
    private readonly _isBatteryDto: IsBatteryDto,
  ) {}

  public build(batteries: unknown): BatteriesDto | undefined {
    const batteriesDto = new BatteriesDto();

    if (typeof batteries !== "object" || batteries === null) {
      return undefined;
    }

    if (!("batteries" in batteries)) {
      return undefined;
    }

    if (IsBatteriesDto.run(batteries) === false) {
      return undefined;
    }

    for (const battery of batteries.batteries) {
      if (this._isBatteryDto.run(battery) === false) {
        continue;
      }

      let voltage: StateDto<number> | undefined = undefined;

      if (battery.voltage !== undefined) {
        voltage = this._setStateDto.run<number>(battery.voltage);
      }

      const levelDto = this._setStateDto.run<number>(battery.level);

      if (levelDto === undefined) {
        continue;
      }

      batteriesDto.batteries.push(new BatteryDto(levelDto, voltage));
    }

    return batteriesDto;
  }
}
