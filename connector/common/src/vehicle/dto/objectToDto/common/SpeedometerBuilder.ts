import SpeedometerDto from "../../../components/speedometer/SpeedometerDto.ts";
import IsSpeedometerDto from "../../../components/speedometer/IsSpeedometerDto.ts";

import SetStateDto from "./SetStateDto.ts";

export default class SpeedometerBuilder {
  constructor(
    private readonly _setStateDto: SetStateDto,
    private readonly _isSpeedometerDto: IsSpeedometerDto,
  ) {}

  public build(speedometer: unknown): SpeedometerDto | undefined {
    if (!this._isSpeedometerDto.run(speedometer)) {
      return undefined;
    }

    const state = this._setStateDto.run<number>(speedometer.state);

    if (state === undefined) {
      return undefined;
    }

    return new SpeedometerDto(state);
  }
}
