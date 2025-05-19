import { JsonConnectionModule } from "../../../iot/network/JsonConnectionModule.ts";
import { JsonNetwork } from "../../../iot/network/JsonNetwork.ts";
import { Network } from "../../../../components/iot/network/Network.ts";

export class NetworkBuilder {
  public build(network: Network): JsonNetwork {
    const jsonConnectionModules: JsonConnectionModule[] = [];

    const connectionModules = network.connectionModules;

    for (const connectionModule of connectionModules) {
      jsonConnectionModules.push(
        new JsonConnectionModule(
          connectionModule.imei,
          connectionModule.state,
          connectionModule.detectedProtocolVersion,
          connectionModule.setProtocolVersion,
          connectionModule.detectedProtocol,
          connectionModule.setProtocol,
        ),
      );
    }

    return new JsonNetwork(jsonConnectionModules);
  }
}

export default NetworkBuilder;
