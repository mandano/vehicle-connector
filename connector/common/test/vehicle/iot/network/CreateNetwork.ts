import { Network } from "../../../../src/vehicle/components/iot/network/Network.ts";
import { ConnectionModule } from "../../../../src/vehicle/components/iot/network/ConnectionModule.ts";

import { CreateConnectionModules } from "./CreateConnectionModules.ts";

export class CreateNetwork {
  public run(options?: { connectionModules?: ConnectionModule[], originatedAt?: Date }): Network {
    const connectionModules =
      options !== undefined && options["connectionModules"] !== undefined
        ? options["connectionModules"]
        : new CreateConnectionModules().run({ originatedAt: options?.originatedAt });

    return new Network(connectionModules);
  }
}

export default CreateNetwork;
