import IsNumberStateDto from "../state/IsNumberStateDto.ts";

import OdometerDto from "./OdometerDto.ts";

export default class IsOdometerDto {
  constructor(private readonly _isNumberStateDto: IsNumberStateDto) {}

  public run(odometerDto: unknown): odometerDto is OdometerDto {
    if (typeof odometerDto !== "object" || odometerDto === null) {
      return false;
    }

    return !(
      !("state" in odometerDto) ||
      !this._isNumberStateDto.run(odometerDto.state)
    );
  }
}
