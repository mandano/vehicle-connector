import NetworkDto from "../../../components/iot/network/NetworkDto.ts";
import ConnectionModuleDto from "../../../components/iot/network/ConnectionModuleDto.ts";
import IsNetworkDto from "../../../components/iot/network/IsNetworkDto.ts";

import ConnectionModuleBuilder from "./ConnectionModuleBuilder.ts";

export default class NetworkBuilder {
  constructor(
    private readonly _connectionModuleBuilder: ConnectionModuleBuilder,
    private readonly _isNetworkDto: IsNetworkDto,
  ) {}

  public build(network: unknown): NetworkDto | undefined {
    const connectionModulesDto: ConnectionModuleDto[] = [];

    if (!this._isNetworkDto.run(network)) {
      return undefined;
    }

    for (const connectionModule of network.connectionModules) {
      const connectionModuleDto =
        this._connectionModuleBuilder.build(connectionModule);

      if (connectionModuleDto === undefined) {
        continue;
      }

      connectionModulesDto.push(connectionModuleDto);
    }

    return new NetworkDto(connectionModulesDto);
  }
}
