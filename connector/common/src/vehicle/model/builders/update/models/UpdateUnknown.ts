import { Unknown } from "../../../models/Unknown.ts";
import { UpdateEnergy } from "../components/UpdateEnergy.ts";
import UpdateConnectionModules from "../components/connectionModule/UpdateConnectionModules.ts";
import { UpdateIoT } from "../components/UpdateIoT.ts";
import ContainsIot from "../../../../components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../components/iot/network/ContainsNetwork.ts";

export class UpdateUnknown {
  private _updateEnergy: UpdateEnergy;
  private _updateConnectionModules: UpdateConnectionModules;
  private _updateIoT: UpdateIoT;

  constructor(
    updateEnergy: UpdateEnergy,
    updateConnectionModules: UpdateConnectionModules,
    updateIoT: UpdateIoT,
  ) {
    this._updateEnergy = updateEnergy;
    this._updateConnectionModules = updateConnectionModules;
    this._updateIoT = updateIoT;
  }

  public run(toBeUpdated: Unknown, updateBy: Unknown): Unknown {
    this.network(toBeUpdated, updateBy);
    this.energy(toBeUpdated, updateBy);
    this.iot(toBeUpdated, updateBy);

    return toBeUpdated;
  }

  private network(toBeUpdated: Unknown, updateBy: Unknown) {
    this.connectionModules(toBeUpdated, updateBy);
  }

  private energy(toBeUpdated: Unknown, updateBy: Unknown) {
    if (updateBy.batteries === undefined) {
      return;
    }

    if (toBeUpdated.batteries === undefined) {
      toBeUpdated.batteries = updateBy.batteries;
    }

    this._updateEnergy.run(toBeUpdated.batteries, updateBy.batteries);
  }

  private iot(toBeUpdated: Unknown, updateBy: Unknown) {
    if (updateBy.ioT === undefined) {
      return;
    }

    if (toBeUpdated.ioT === undefined) {
      toBeUpdated.ioT = updateBy.ioT;
    }

    this._updateIoT.run(toBeUpdated.ioT, updateBy.ioT);
  }

  private connectionModules(toBeUpdated: Unknown, updateBy: Unknown) {
    if (
      ContainsIot.run(toBeUpdated) === false ||
      toBeUpdated.ioT === undefined ||
      ContainsIot.run(updateBy) === false ||
      updateBy.ioT === undefined
    ) {
      return undefined;
    }

    if (
      ContainsNetwork.run(toBeUpdated.ioT) === false ||
      toBeUpdated.ioT.network === undefined ||
      ContainsNetwork.run(updateBy.ioT) === false ||
      updateBy.ioT.network === undefined
    ) {
      return undefined;
    }

    if (updateBy.ioT.network.connectionModules === undefined) {
      return;
    }

    if (toBeUpdated.ioT.network.connectionModules === undefined) {
      toBeUpdated.ioT.network.connectionModules =
        updateBy.ioT.network.connectionModules;
    }

    toBeUpdated.ioT.network.connectionModules = this._updateConnectionModules.run(
      toBeUpdated.ioT.network.connectionModules,
      updateBy.ioT.network.connectionModules,
    );
  }
}
