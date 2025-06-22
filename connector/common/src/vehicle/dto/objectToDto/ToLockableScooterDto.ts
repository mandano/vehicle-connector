import LockableScooterDto from "../../model/models/LockableScooterDto.ts";
import LockStateDto from "../../components/lock/LockStateDto.ts";
import BatteriesDto from "../../components/energy/BatteriesDto.ts";
import IotDto from "../../components/iot/IotDto.js";
import SpeedometerDto from "../../components/speedometer/SpeedometerDto.ts";
import OdometerDto from "../../components/odometer/OdometerDto.ts";

import LockBuilder from "./common/LockBuilder.ts";
import BatteriesBuilder from "./common/BatteriesBuilder.ts";
import IotBuilder from "./common/IotBuilder.ts";
import SpeedometerBuilder from "./common/SpeedometerBuilder.ts";
import OdometerBuilder from "./common/OdometerBuilder.ts";

export default class ToLockableScooterDto {
  constructor(
    private readonly _lock: LockBuilder,
    private readonly _batteries: BatteriesBuilder,
    private readonly _ioT: IotBuilder,
    private readonly _speedometer: SpeedometerBuilder,
    private readonly _odometer: OdometerBuilder,
  ) {}

  public run(model: unknown): LockableScooterDto | undefined {
    if (typeof model !== "object" || model === null) {
      return undefined;
    }

    let lock: LockStateDto | undefined = undefined;
    if ("lock" in model) {
      lock = this._lock.build(model.lock);
    }

    let batteries: BatteriesDto | undefined = undefined;
    if ("batteries" in model) {
      batteries = this._batteries.build(model.batteries);
    }

    let ioT: IotDto | undefined = undefined;
    if ("ioT" in model) {
      ioT = this._ioT.build(model.ioT);
    }

    let speedometer: SpeedometerDto | undefined = undefined;
    if ("speedometer" in model) {
      speedometer = this._speedometer.build(model.speedometer);
    }

    let odometer: OdometerDto | undefined = undefined;
    if ("odometer" in model) {
      odometer = this._odometer.build(model.odometer);
    }

    return new LockableScooterDto(lock, batteries, ioT, speedometer, odometer);
  }
}
