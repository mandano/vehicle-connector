import Unknown from "../../../model/models/Unknown.ts";
import UnknownDto from "../../../model/models/UnknownDto.ts";
import BatteriesDto from "../../../components/energy/BatteriesDto.ts";
import IotDto from "../../../components/iot/IotDto.ts";
import OdometerDto from "../../../components/odometer/OdometerDto.ts";
import SpeedometerDto from "../../../components/speedometer/SpeedometerDto.ts";
import LockStateDto from "../../../components/lock/LockStateDto.ts";

import BatteriesBuilder from "./common/BatteriesBuilder.ts";
import OdometerBuilder from "./common/OdometerBuilder.ts";
import SpeedometerBuilder from "./common/SpeedometerBuilder.ts";
import LockBuilder from "./common/LockBuilder.ts";
import IotBuilder from "./common/IotBuilder.ts";

export default class ToUnknownDto {
  constructor(
    private readonly _iotBuilder: IotBuilder,
    private readonly _energyBuilder: BatteriesBuilder,
    private readonly _odometerBuilder: OdometerBuilder,
    private readonly _speedometerBuilder: SpeedometerBuilder,
    private readonly _lockBuilder: LockBuilder,
  ) {}

  public run(model: Unknown): UnknownDto {
    let batteriesDto: BatteriesDto | undefined = undefined;

    if (model.batteries) {
      batteriesDto = this._energyBuilder.build(model.batteries);
    }

    let iotDto: IotDto | undefined = undefined;

    if (model.ioT) {
      iotDto = this._iotBuilder.build(model.ioT);
    }

    let odometerDto: OdometerDto | undefined = undefined;
    if (model.odometer) {
      odometerDto = this._odometerBuilder.build(model.odometer);
    }

    let speedometerDto: SpeedometerDto | undefined = undefined;
    if (model.speedometer) {
      speedometerDto = this._speedometerBuilder.build(model.speedometer);
    }

    let lockStateDto: LockStateDto | undefined = undefined;
    if (model.lock) {
      lockStateDto = this._lockBuilder.build(model.lock);
    }

    return new UnknownDto(
      batteriesDto,
      iotDto,
      lockStateDto,
      speedometerDto,
      odometerDto,
    );
  }
}
