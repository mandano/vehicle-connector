import PositionDto from "../../../components/iot/position/PositionDto.ts";
import IsPositionDto from "../../../components/iot/position/IsPositionDto.ts";

import SetStateDto from "./SetStateDto.ts";

export default class PositionBuilder {
  constructor(
    private readonly _setStateDto: SetStateDto,
    private readonly _isPositionDto: IsPositionDto,
  ) {}

  public build(position: unknown): PositionDto | undefined {
    if (this._isPositionDto.run(position) === false) {
      return undefined;
    }

    let accuracy = undefined;
    if (position.accuracy) {
      accuracy = this._setStateDto.run<number>(position.accuracy);
    }

    const latitude = this._setStateDto.run<number>(position.latitude);
    const longitude = this._setStateDto.run<number>(position.longitude);

    if (latitude === undefined || longitude === undefined) {
      return undefined;
    }

    return new PositionDto(
      latitude,
      longitude,
      new Date(position.createdAt),
      accuracy,
    );
  }
}
