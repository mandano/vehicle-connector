import { Batteries } from "../../../components/energy/Batteries.ts";
import { IoT } from "../../../components/iot/IoT.ts";
import LockableScooter from "../../../model/models/LockableScooter.ts";
import { Lock } from "../../../components/lock/Lock.ts";
import { Speedometer } from "../../../components/speedometer/Speedometer.ts";
import { SendActionRequestInterface } from "../../../model/actions/SendActionRequestInterface.ts";
import LockableScooterDto from "../../../model/models/LockableScooterDto.ts";
import Odometer from "../../../components/odometer/Odometer.ts";

import IotBuilder from "./common/IotBuilder.ts";
import BatteriesBuilder from "./common/BatteriesBuilder.ts";
import OdometerBuilder from "./common/OdometerBuilder.ts";
import SpeedometerBuilder from "./common/SpeedometerBuilder.ts";
import LockBuilder from "./common/LockBuilder.ts";

export default class FromLockableScooterDto {
  constructor(
    private readonly _iotBuilder: IotBuilder,
    private readonly _batteriesBuilder: BatteriesBuilder,
    private readonly _odometerBuilder: OdometerBuilder,
    private readonly _speedometerBuilder: SpeedometerBuilder,
    private readonly _lockBuilder: LockBuilder,
    private readonly _sendActionRequest: SendActionRequestInterface,
  ) {}

  public run(lockableScooterDto: LockableScooterDto): LockableScooter {
    let batteries: Batteries | undefined;

    if (lockableScooterDto.batteries !== undefined) {
      batteries = this._batteriesBuilder.build(lockableScooterDto.batteries);
    }

    let ioT: IoT | undefined;

    if (lockableScooterDto.ioT) {
      ioT = this._iotBuilder.build(lockableScooterDto.ioT);
    }

    let lock: Lock | undefined;
    if (lockableScooterDto.lock) {
      const lockState = this._lockBuilder.build(lockableScooterDto.lock);
      lock = new Lock(this._sendActionRequest, lockState);
    } else {
      lock = new Lock(this._sendActionRequest, undefined);
    }

    let speedometer: Speedometer | undefined;

    if (lockableScooterDto.speedometer) {
      speedometer = this._speedometerBuilder.build(
        lockableScooterDto.speedometer,
      );
    }

    let odometer: Odometer | undefined;

    if (lockableScooterDto.odometer) {
      odometer = this._odometerBuilder.build(lockableScooterDto.odometer);
    }

    return new LockableScooter(lock, batteries, ioT, speedometer, odometer);
  }
}
