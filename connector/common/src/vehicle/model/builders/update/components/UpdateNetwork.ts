import { Network } from "../../../../components/iot/network/Network.ts";

import UpdateConnectionModules from "./connectionModule/UpdateConnectionModules.ts";
import { UpdateNetworkInterface } from "./UpdateNetworkInterface.ts";

export class UpdateNetwork implements UpdateNetworkInterface {
  private _updateConnectionModules: UpdateConnectionModules;

  constructor(updateConnectionModules: UpdateConnectionModules) {
    this._updateConnectionModules = updateConnectionModules;
  }

  public run(toBeUpdated: Network, updateBy: Network): Network {
    if (
      updateBy.connectionModules === undefined ||
      updateBy.connectionModules.length === 0
    ) {
      return toBeUpdated;
    }

    if (
      toBeUpdated.connectionModules === undefined ||
      toBeUpdated.connectionModules.length === 0
    ) {
      toBeUpdated.connectionModules = updateBy.connectionModules;
    }

    toBeUpdated.connectionModules = this._updateConnectionModules.run(
      toBeUpdated.connectionModules,
      updateBy.connectionModules,
    );

    return toBeUpdated;
  }
}
