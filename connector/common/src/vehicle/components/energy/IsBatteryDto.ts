import IsNumberStateDto from "../state/IsNumberStateDto.ts";

import BatteryDto from "./BatteryDto.ts";

export default class IsBatteryDto {
  constructor(private readonly _isNumberStateDto: IsNumberStateDto) {}

  public run(battery: unknown): battery is BatteryDto {
    if (typeof battery !== "object" || battery === null) {
      return false;
    }

    if (!("level" in battery)) {
      return false;
    }

    const level = (battery as BatteryDto).level;
    if (this._isNumberStateDto.run(level) === false) {
      return false;
    }

    if ("voltage" in battery) {
      const voltage = (battery as BatteryDto).voltage;
      if (this._isNumberStateDto.run(voltage) === false) {
        return false;
      }
    }

    return true;
  }
}
