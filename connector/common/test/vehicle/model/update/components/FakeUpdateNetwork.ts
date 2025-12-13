import { UpdateNetworkInterface } from "../../../../../src/vehicle/model/builders/update/components/network/UpdateNetworkInterface.ts";
import { Network } from "../../../../../src/vehicle/components/iot/network/Network.ts";
import UpdateNetworkResult
  from "../../../../../src/vehicle/model/builders/update/components/network/UpdateNetworkResult.ts";

export class FakeUpdateNetwork implements UpdateNetworkInterface {
  private readonly _updated: Network;

  constructor(updated: Network) {
    this._updated = updated;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public run(toBeUpdated: Network, updateBy: Network): UpdateNetworkResult {
    if (toBeUpdated !== undefined) {
      Object.assign(toBeUpdated, this._updated);
    }

    return new UpdateNetworkResult(this._updated, undefined);
  }
}
