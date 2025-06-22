import Position from "../../../../components/iot/Position.ts";
import PositionDto from "../../../../components/iot/position/PositionDto.ts";

import SetStateDto from "./SetStateDto.ts";

export default class PositionBuilder {
  constructor(private readonly _setStateDto: SetStateDto) {}

  public build(position: Position): PositionDto {
    let accuracy = undefined;
    if (position.accuracy) {
      accuracy = this._setStateDto.run(position.accuracy);
    }

    return new PositionDto(
      this._setStateDto.run(position.latitude),
      this._setStateDto.run(position.longitude),
      position.createdAt,
      accuracy,
    );
  }
}
