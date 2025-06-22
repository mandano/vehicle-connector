import Batteries from "../../../../components/energy/Batteries.ts";
import BatteriesDto from "../../../../components/energy/BatteriesDto.ts";
import StateDto from "../../../../components/state/StateDto.ts";
import BatteryDto from "../../../../components/energy/BatteryDto.ts";

import SetStateDto from "./SetStateDto.ts";

export default class BatteriesBuilder {
  constructor(private readonly _setStateDto: SetStateDto) {}

  public build(batteries: Batteries): BatteriesDto {
    const batteriesDto = new BatteriesDto();

    for (const battery of batteries.batteries) {
      let voltage: StateDto<number> | undefined = undefined;

      if (battery.voltage !== undefined) {
        voltage = this._setStateDto.run(battery.voltage);
      }

      batteriesDto.batteries.push(
        new BatteryDto(this._setStateDto.run(battery.level), voltage),
      );
    }

    return batteriesDto;
  }
}
