import LockableScooter from "../../../../models/LockableScooter.ts";
import UpdateBatteries from "../../components/energy/batteries/UpdateBatteries.ts";
import UpdateIoT from "../../components/ioT/UpdateIoT.ts";
import Unknown from "../../../../models/Unknown.ts";
import UpdateSpeedometer from "../../components/speedometer/UpdateSpeedometer.ts";
import UpdateBatteriesResult from "../../components/energy/batteries/UpdateBatteriesResult.ts";
import UpdateLock from "../../components/lock/UpdateLock.ts";
import UpdateLockResult from "../../components/lock/UpdateLockResult.ts";
import UpdateIotResult from "../../components/ioT/UpdateIotResult.ts";
import UpdateSpeedometerResult from "../../components/speedometer/UpdateSpeedometerResult.ts";

import UpdateLockableScooterResult from "./UpdateLockableScooterResult.ts";
import LockableScooterChanges from "./LockableScooterChanges.ts";

export default class UpdateLockableScooter {
  constructor(
    private readonly _updateBatteries: UpdateBatteries,
    private readonly _updateIoT: UpdateIoT,
    private readonly _updateLock: UpdateLock,
    private readonly _updateSpeedometer: UpdateSpeedometer,
  ) {}

  public run(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ): UpdateLockableScooterResult {
    const updateBatteriesResult = this.batteries(toBeUpdated, updateBy);
    const updateLockResult = this.lock(toBeUpdated, updateBy);
    const updateIotResult = this.iot(toBeUpdated, updateBy);
    const updateSpeedometerResult = this.speedometer(toBeUpdated, updateBy);

    const lockableScooter = new LockableScooter(
      updateLockResult.new,
      updateBatteriesResult.new,
      updateIotResult.new,
      updateSpeedometerResult.new,
    );

    return new UpdateLockableScooterResult(
      lockableScooter,
      new LockableScooterChanges(
        updateLockResult.changes,
        updateBatteriesResult.changes,
        updateIotResult.changes,
      ),
    );
  }

  private batteries(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ): UpdateBatteriesResult {
    return this._updateBatteries.run(toBeUpdated.batteries, updateBy.batteries);
  }

  private iot(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ): UpdateIotResult {
    return this._updateIoT.run(toBeUpdated.ioT, updateBy.ioT);
  }

  private lock(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ): UpdateLockResult {
    return this._updateLock.run(toBeUpdated.lock, updateBy.lock);
  }

  private speedometer(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ): UpdateSpeedometerResult {
    return this._updateSpeedometer.run(
      toBeUpdated.speedometer,
      updateBy.speedometer,
    );
  }
}
