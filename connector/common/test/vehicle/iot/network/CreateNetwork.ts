import { Network } from "../../../../src/vehicle/components/iot/network/Network.ts";
import { ConnectionModule } from "../../../../src/vehicle/components/iot/network/ConnectionModule.ts";

import { CreateConnectionModules } from "./CreateConnectionModules.ts";

export class CreateNetwork {
  public run(options?: { connectionModules?: ConnectionModule[] }): Network {
    const connectionModules =
      options !== undefined && options["connectionModules"] !== undefined
        ? options["connectionModules"]
        : new CreateConnectionModules().run();

    return new Network(connectionModules);
  }
}
