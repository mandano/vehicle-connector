import { LockableScooter } from "../../../models/LockableScooter.ts";
import { UpdateEnergy } from "../components/UpdateEnergy.ts";
import UpdateConnectionModules from "../components/connectionModule/UpdateConnectionModules.ts";
import { UpdateIoT } from "../components/UpdateIoT.ts";
import { Unknown } from "../../../models/Unknown.ts";
import { UpdateLockState } from "../components/UpdateLockState.ts";
import { UpdateSpeedometer } from "../components/speedometer/UpdateSpeedometer.ts";
import ContainsIot from "../../../../components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../components/iot/network/ContainsNetwork.ts";
import IoT from "../../../../components/iot/IoT.ts";
import Network from "../../../../components/iot/network/Network.ts";

// TODO: not immutable
export class UpdateLockableScooter {
  constructor(
    private readonly _updateEnergy: UpdateEnergy,
    private readonly _updateConnectionModules: UpdateConnectionModules,
    private readonly _updateIoT: UpdateIoT,
    private readonly _updateLockState: UpdateLockState,
    private readonly _updateSpeedometer: UpdateSpeedometer,
  ) {}

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
    if (ContainsIot.run(updateBy) === false || updateBy.ioT === undefined) {
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

    if (toBeUpdated.ioT === undefined) {
      toBeUpdated.ioT = new IoT(
        new Network(updateBy.ioT.network.connectionModules),
      );
      return;
    }

    if (toBeUpdated.ioT.network === undefined) {
      toBeUpdated.ioT.network = new Network(
        updateBy.ioT.network.connectionModules,
      );
      return;
    }

    if (toBeUpdated.ioT.network.connectionModules.length === 0) {
      toBeUpdated.ioT.network.connectionModules =
        updateBy.ioT.network.connectionModules;
    }

    this._updateConnectionModules.run(
      toBeUpdated.ioT.network.connectionModules,
      updateBy.ioT.network.connectionModules,
    );
  }

  private lock(
    toBeUpdated: LockableScooter,
    updateBy: LockableScooter | Unknown,
  ) {
    if (updateBy.lock === undefined || updateBy.lock.state === undefined) {
      return;
    }

    if (toBeUpdated.lock === undefined) {
      toBeUpdated.lock = updateBy.lock;
      return;
    }

    if (toBeUpdated.lock.state === undefined) {
      toBeUpdated.lock.state = updateBy.lock.state;
      return;
    }

    this._updateLockState.run(toBeUpdated.lock.state, updateBy.lock.state);
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
