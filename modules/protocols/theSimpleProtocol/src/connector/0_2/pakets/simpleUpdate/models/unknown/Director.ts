import { SimpleUpdate } from "../../SimpleUpdate.ts";
import { Unknown } from "../../../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";

import { IotBuilder } from "./IotBuilder.ts";
import { SpeedometerBuilder } from "./SpeedometerBuilder.ts";
import { BatteriesBuilder } from "./BatteriesBuilder.ts";

export class Director {
  constructor(
    private _ioTBuilder: IotBuilder,
    private _speedometerBuilder: SpeedometerBuilder,
    private _batteriesBuilder: BatteriesBuilder,
  ) {}

  public build(updateSimpleScooter: SimpleUpdate): Unknown {
    const ioT = this._ioTBuilder.build(updateSimpleScooter);
    const speedometer = this._speedometerBuilder.build(updateSimpleScooter);
    const batteries = this._batteriesBuilder.build(updateSimpleScooter);

    return new Unknown(batteries, ioT, undefined, speedometer);
  }
}
