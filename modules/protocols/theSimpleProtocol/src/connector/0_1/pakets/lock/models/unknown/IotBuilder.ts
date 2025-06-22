import { IoT } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/IoT.ts";
import LockPaket from "../../Lock.ts";

import { NetworkBuilder } from "./NetworkBuilder.ts";

export class IotBuilder {
  private _networkBuilder: NetworkBuilder;

  constructor(networkBuilder: NetworkBuilder) {
    this._networkBuilder = networkBuilder;
  }

  public build(lockPaket: LockPaket): IoT {
    const network = this._networkBuilder.build(lockPaket);

    return new IoT(network);
  }
}
