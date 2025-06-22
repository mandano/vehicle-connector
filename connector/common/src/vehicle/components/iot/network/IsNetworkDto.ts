import NetworkDto from "./NetworkDto.ts";
import IsConnectionModuleDto from "./IsConnectionModuleDto.ts";

export default class IsNetworkDto {
  constructor(private readonly _isConnectionModuleDto: IsConnectionModuleDto) {}

  public run(network: unknown): network is NetworkDto {
    if (typeof network !== "object" || network === null) {
      return false;
    }

    if (
      !("connectionModules" in network) ||
      !Array.isArray((network as NetworkDto).connectionModules)
    ) {
      return false;
    }

    for (const connectionModule of (network as NetworkDto).connectionModules) {
      if (!this._isConnectionModuleDto.run(connectionModule)) {
        return false;
      }
    }

    return true;
  }
}
