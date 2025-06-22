import IoT from "../../../../components/iot/IoT.ts";
import IotDto from "../../../../components/iot/IotDto.ts";

import NetworkBuilder from "./NetworkBuilder.ts";
import PositionBuilder from "./PositionBuilder.ts";

export default class IotBuilder {
  constructor(
    private _networkBuilder: NetworkBuilder,
    private _positionBuilder: PositionBuilder,
  ) {}

  public build(ioT: IoT): IotDto {
    let positionDto = undefined;

    if (ioT.position) {
      positionDto = this._positionBuilder.build(ioT.position);
    }

    let networkDto = undefined;

    if (ioT.network) {
      networkDto = this._networkBuilder.build(ioT.network);
    }

    return new IotDto(networkDto, positionDto);
  }
}
