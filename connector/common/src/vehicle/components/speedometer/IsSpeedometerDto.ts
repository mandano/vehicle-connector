import IsNumberStateDto from "../state/IsNumberStateDto.ts";

import SpeedometerDto from "./SpeedometerDto.ts";

export default class IsSpeedometerDto {
  constructor(private readonly _isNumberStateDto: IsNumberStateDto) {}

  public run(speedometerDto: unknown): speedometerDto is SpeedometerDto {
    if (typeof speedometerDto !== "object" || speedometerDto === null) {
      return false;
    }

    return !(
      !("state" in speedometerDto) ||
      !this._isNumberStateDto.run(speedometerDto.state)
    );
  }
}
