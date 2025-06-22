import OdometerDto from "../../../components/odometer/OdometerDto.ts";
import IsOdometerDto from "../../../components/odometer/IsOdometerDto.ts";

import SetStateDto from "./SetStateDto.ts";

export default class OdometerBuilder {
  constructor(
    private readonly _setStateDto: SetStateDto,
    private readonly _isOdometerDto: IsOdometerDto,
  ) {}

  public build(odometer: unknown): OdometerDto | undefined {
    if (!this._isOdometerDto.run(odometer)) {
      return undefined;
    }

    const state = this._setStateDto.run<number>(odometer.state);

    if (state === undefined) {
      return undefined;
    }

    return new OdometerDto(state);
  }
}
