import Batteries from "../../../components/energy/Batteries.ts";
import Unknown from "../../../model/models/Unknown.ts";
import IoT from "../../../components/iot/IoT.ts";
import Speedometer from "../../../components/speedometer/Speedometer.ts";
import Lock from "../../../components/lock/Lock.ts";
import UnknownDto from "../../../model/models/UnknownDto.ts";
import { Odometer } from "../../../components/odometer/Odometer.ts";

import IotBuilder from "./common/IotBuilder.ts";
import BatteriesBuilder from "./common/BatteriesBuilder.ts";
import OdometerBuilder from "./common/OdometerBuilder.ts";
import SpeedometerBuilder from "./common/SpeedometerBuilder.ts";
import LockBuilder from "./common/LockBuilder.ts";

export default class FromUnknownDto {
  constructor(
    private readonly _iotBuilder: IotBuilder,
    private readonly _batteriesBuilder: BatteriesBuilder,
    private readonly _odometerBuilder: OdometerBuilder,
    private readonly _speedometerBuilder: SpeedometerBuilder,
    private readonly _lockBuilder: LockBuilder,
  ) {}

  public run(unknownDto: UnknownDto): Unknown {
    let batteries: Batteries | undefined;

    if (unknownDto.batteries !== undefined) {
      batteries = this._batteriesBuilder.build(unknownDto.batteries);
    }

    let ioT: IoT | undefined;

    if (unknownDto.ioT) {
      ioT = this._iotBuilder.build(unknownDto.ioT);
    }

    let lock: Lock | undefined;
    if (unknownDto.lock) {
      const lockState = this._lockBuilder.build(unknownDto.lock);
      lock = new Lock(undefined, lockState);
    } else {
      lock = new Lock(undefined, undefined);
    }

    let speedometer: Speedometer | undefined;

    if (unknownDto.speedometer) {
      speedometer = this._speedometerBuilder.build(unknownDto.speedometer);
    }

    let odometer: Odometer | undefined;

    if (unknownDto.odometer) {
      odometer = this._odometerBuilder.build(unknownDto.odometer);
    }

    return new Unknown(batteries, ioT, lock, speedometer, odometer);
  }
}
