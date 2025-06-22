import Network from "../../../../components/iot/network/Network.ts";
import NetworkDto from "../../../../components/iot/network/NetworkDto.ts";
import ConnectionModuleDto from "../../../../components/iot/network/ConnectionModuleDto.ts";

import ConnectionModuleBuilder from "./ConnectionModuleBuilder.ts";

export default class NetworkBuilder {
  constructor(
    private readonly _connectionModuleBuilder: ConnectionModuleBuilder,
  ) {}

  public build(network: Network): NetworkDto {
    const connectionModulesDto: ConnectionModuleDto[] = [];

    for (const connectionModule of network.connectionModules) {
      connectionModulesDto.push(
        this._connectionModuleBuilder.build(connectionModule),
      );
    }

    return new NetworkDto(connectionModulesDto);
  }
}
