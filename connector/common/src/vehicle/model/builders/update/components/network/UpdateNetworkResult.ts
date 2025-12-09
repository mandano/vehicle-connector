import Network from "../../../../../components/iot/network/Network.ts";
import PartialNetworkDto from "../../../../../components/iot/network/PartialNetworkDto.ts";

export default class UpdateNetworkResult {
  constructor(
    private readonly _new: Network | undefined,
    private readonly _changes: PartialNetworkDto | undefined = undefined,
  ) {
  }

  get new(): Network | undefined {
    return this._new;
  }

  get changes(): PartialNetworkDto | undefined {
    return this._changes;
  }
}
