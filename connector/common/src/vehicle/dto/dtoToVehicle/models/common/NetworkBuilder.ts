import Network from "../../../../components/iot/network/Network.ts";
import NetworkDto from "../../../../components/iot/network/NetworkDto.ts";
import ConnectionModule from "../../../../components/iot/network/ConnectionModule.ts";

import ConnectionModuleBuilder from "./ConnectionModuleBuilder.ts";

export default class NetworkBuilder {
  constructor(
    private readonly _connectionModuleBuilder: ConnectionModuleBuilder,
  ) {}

  public build(networkDto: NetworkDto): Network {
    const connectionModules: ConnectionModule[] = [];

    for (const connectionModule of networkDto.connectionModules) {
      connectionModules.push(
        this._connectionModuleBuilder.build(connectionModule),
      );
    }

    return new Network(connectionModules);
  }
}
