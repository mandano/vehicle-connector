import IotDto from "../../../components/iot/IotDto.ts";
import IsIotDto from "../../../components/iot/IsIotDto.ts";

import NetworkBuilder from "./NetworkBuilder.ts";
import PositionBuilder from "./PositionBuilder.ts";

export default class IotBuilder {
  constructor(
    private readonly _networkBuilder: NetworkBuilder,
    private readonly _positionBuilder: PositionBuilder,
    private readonly _isIotDto: IsIotDto,
  ) {}

  public build(ioT: unknown): IotDto | undefined {
    if (this._isIotDto.run(ioT) === false) {
      return undefined;
    }

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
