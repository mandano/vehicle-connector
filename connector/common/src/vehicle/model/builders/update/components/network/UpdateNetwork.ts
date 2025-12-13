import Network from "../../../../../components/iot/network/Network.ts";
import UpdateConnectionModules from "../connectionModules/UpdateConnectionModules.ts";
import NetworkToChanges from "../../../../../components/iot/network/NetworkToChanges.ts";
import CloneNetwork from "../../../../../components/iot/network/CloneNetwork.ts";

import UpdateNetworkInterface from "./UpdateNetworkInterface.ts";
import UpdateNetworkResult from "./UpdateNetworkResult.ts";

export class UpdateNetwork implements UpdateNetworkInterface {
  constructor(
    private _updateConnectionModules: UpdateConnectionModules,
    private _networkToChanges: NetworkToChanges,
    private _cloneNetwork: CloneNetwork,
  ) {}

  public run(
    toBeUpdated: Network | undefined,
    updateBy: Network | undefined,
  ): UpdateNetworkResult {
    if (updateBy === undefined && toBeUpdated === undefined) {
      return new UpdateNetworkResult(undefined, undefined);
    }

    if (updateBy === undefined) {
      return new UpdateNetworkResult(
        this._cloneNetwork.run(toBeUpdated!),
        this._networkToChanges.run(toBeUpdated!),
      );
    }

    if (toBeUpdated === undefined) {
      return new UpdateNetworkResult(
        this._cloneNetwork.run(updateBy!),
        undefined,
      );
    }

    if (
      updateBy.connectionModules === undefined ||
      updateBy.connectionModules.length === 0
    ) {
      return new UpdateNetworkResult(toBeUpdated, undefined);
    }

    if (
      toBeUpdated.connectionModules === undefined ||
      toBeUpdated.connectionModules.length === 0
    ) {
      // TODO: make transfer connectionModules immutable
      return new UpdateNetworkResult(
        new Network(updateBy.connectionModules),
        undefined,
      );
    }
    const updateConnectionModulesResult = this._updateConnectionModules.run(
      toBeUpdated.connectionModules,
      updateBy.connectionModules,
    );
    const connectionModules = updateConnectionModulesResult.new;

    const network = new Network(connectionModules);

    return new UpdateNetworkResult(network, undefined);
  }
}

export default UpdateNetwork;
