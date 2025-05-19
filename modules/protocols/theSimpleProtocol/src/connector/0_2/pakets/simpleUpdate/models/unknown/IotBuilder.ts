import { SimpleUpdate } from "../../SimpleUpdate.ts";
import { IoT } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/IoT.ts";

import { NetworkBuilder } from "./NetworkBuilder.ts";
import { PositionBuilder } from "./PositionBuilder.ts";

export class IotBuilder {
  private _networkBuilder: NetworkBuilder;
  private _positionBuilder: PositionBuilder;

  constructor(
    networkBuilder: NetworkBuilder,
    positionBuilder: PositionBuilder,
  ) {
    this._networkBuilder = networkBuilder;
    this._positionBuilder = positionBuilder;
  }

  public build(updateSimpleScooter: SimpleUpdate): IoT {
    const network = this._networkBuilder.build(updateSimpleScooter);
    const position = this._positionBuilder.build(updateSimpleScooter);

    return new IoT(network, position);
  }
}
