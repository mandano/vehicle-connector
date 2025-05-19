import { LockableScooter } from "../../../models/LockableScooter.ts";
import { UpdateEnergy } from "../components/UpdateEnergy.ts";
import { UpdateConnectionModules } from "../components/UpdateConnectionModules.ts";
import { UpdateIoT } from "../components/UpdateIoT.ts";
import { Unknown } from "../../../models/Unknown.ts";
import { UpdateLock } from "../components/UpdateLock.ts";
import { UpdateSpeedometer } from "../components/speedometer/UpdateSpeedometer.ts";
import ContainsIot from "../../../../components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../components/iot/network/ContainsNetwork.ts";

export class UpdateLockableScooter {
  private _updateEnergy: UpdateEnergy;
  private _updateConnectionModules: UpdateConnectionModules;
  private _updateIoT: UpdateIoT;
  private _updateLock: UpdateLock;

  constructor(
    updateEnergy: UpdateEnergy,
    updateConnectionModules: UpdateConnectionModules,
    updateIoT: UpdateIoT,
    updateLock: UpdateLock,
    private _updateSpeedometer: UpdateSpeedometer,
  ) {
    this._updateEnergy = updateEnergy;
    this._updateConnectionModules = updateConnectionModules;
    this._updateIoT = updateIoT;
    this._updateLock = updateLock;
    this._updateSpeedometer = _updateSpeedometer;
  }

  public run(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ): LockableScooter {
    this.network(toBeUpdated, updateBy);
    this.energy(toBeUpdated, updateBy);
    this.iot(toBeUpdated, updateBy);
    this.lock(toBeUpdated, updateBy);
    this.speedometer(toBeUpdated, updateBy);

    return toBeUpdated;
  }

  private network(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ) {
    this.connectionModules(toBeUpdated, updateBy);
  }

  private energy(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ) {
    if (updateBy.batteries === undefined) {
      return;
    }

    if (toBeUpdated.batteries === undefined) {
      toBeUpdated.batteries = updateBy.batteries;
    }

    this._updateEnergy.run(toBeUpdated.batteries, updateBy.batteries);
  }

  private iot(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ) {
    if (updateBy.ioT === undefined) {
      return;
    }

    if (toBeUpdated.ioT === undefined) {
      toBeUpdated.ioT = updateBy.ioT;
    }

    this._updateIoT.run(toBeUpdated.ioT, updateBy.ioT);
  }

  private connectionModules(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ) {
    if (
      ContainsIot.run(updateBy) === false ||
      updateBy.ioT === undefined
    ) {
      return undefined;
    }

    if (
      ContainsNetwork.run(updateBy.ioT) === false ||
      updateBy.ioT.network === undefined
    ) {
      return undefined;
    }

    if (updateBy.ioT.network.connectionModules === undefined) {
      return;
    }

    if (toBeUpdated.network.connectionModules === undefined) {
      toBeUpdated.network.connectionModules =
        updateBy.ioT.network.connectionModules;
    }

    this._updateConnectionModules.run(
      toBeUpdated.network.connectionModules,
      updateBy.ioT.network.connectionModules,
    );
  }

  private lock(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ) {
    if (updateBy.lock === undefined) {
      return;
    }

    if (toBeUpdated.lock === undefined) {
      toBeUpdated.lock = updateBy.lock;
    }

    this._updateLock.run(toBeUpdated.lock, updateBy.lock);
  }

  private speedometer(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ) {
    if (updateBy.speedometer === undefined) {
      return;
    }

    if (toBeUpdated.speedometer === undefined) {
      toBeUpdated.speedometer = updateBy.speedometer;
    }

    this._updateSpeedometer.run(toBeUpdated.speedometer, updateBy.speedometer);
  }
}
