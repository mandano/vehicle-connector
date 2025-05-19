import { IoT } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/IoT.ts";
import { Lock } from "../../Lock.ts";

import { NetworkBuilder } from "./NetworkBuilder.ts";

export class IotBuilder {
  private _networkBuilder: NetworkBuilder;

  constructor(networkBuilder: NetworkBuilder) {
    this._networkBuilder = networkBuilder;
  }

  public build(lock: Lock): IoT {
    const network = this._networkBuilder.build(lock);

    return new IoT(network);
  }
}
