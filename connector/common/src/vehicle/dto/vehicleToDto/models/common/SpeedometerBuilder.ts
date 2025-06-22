import { Speedometer } from "../../../../components/speedometer/Speedometer.ts";
import SpeedometerDto from "../../../../components/speedometer/SpeedometerDto.ts";

import SetStateDto from "./SetStateDto.ts";

export default class SpeedometerBuilder {
  constructor(private readonly _setStateDto: SetStateDto) {}

  public build(speedometer: Speedometer): SpeedometerDto {
    return new SpeedometerDto(this._setStateDto.run(speedometer.state));
  }
}
