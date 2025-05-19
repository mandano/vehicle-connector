import { UpdateNetworkInterface } from "../../../../../src/vehicle/model/builders/update/components/UpdateNetworkInterface.ts";
import { Network } from "../../../../../src/vehicle/components/iot/network/Network.ts";

export class FakeUpdateNetwork implements UpdateNetworkInterface {
  private readonly _updated: Network;

  constructor(updated: Network) {
    this._updated = updated;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public run(toBeUpdated: Network, updateBy: Network): Network {
    Object.assign(toBeUpdated, this._updated);
    return this._updated;
  }
}
