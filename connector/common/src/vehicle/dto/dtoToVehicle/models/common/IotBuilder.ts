import IoT from "../../../../components/iot/IoT.ts";
import IotDto from "../../../../components/iot/IotDto.ts";

import NetworkBuilder from "./NetworkBuilder.ts";
import PositionBuilder from "./PositionBuilder.ts";

export default class IotBuilder {
  constructor(
    private _networkBuilder: NetworkBuilder,
    private _positionBuilder: PositionBuilder,
  ) {}

  public build(iotDto: IotDto): IoT {
    let position = undefined;

    if (iotDto.position) {
      position = this._positionBuilder.build(iotDto.position);
    }

    let network = undefined;

    if (iotDto.network) {
      network = this._networkBuilder.build(iotDto.network);
    }

    return new IoT(network, position);
  }
}
