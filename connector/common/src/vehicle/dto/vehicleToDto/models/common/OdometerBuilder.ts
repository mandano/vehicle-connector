import { Odometer } from "../../../../components/odometer/Odometer.ts";
import OdometerDto from "../../../../components/odometer/OdometerDto.ts";

import SetStateDto from "./SetStateDto.ts";

export default class OdometerBuilder {
  constructor(private readonly _setStateDto: SetStateDto) {}

  public build(odometer: Odometer): OdometerDto {
    return new OdometerDto(this._setStateDto.run(odometer.state));
  }
}
