import Position from "../../../../components/iot/Position.ts";
import PositionDto from "../../../../components/iot/position/PositionDto.ts";

import SetState from "./SetState.ts";

export default class PositionBuilder {
  constructor(private readonly _setState: SetState) {}

  public build(position: PositionDto): Position | undefined {
    let accuracy = undefined;
    if (position.accuracy) {
      accuracy = this._setState.run<number>(position.accuracy);
    }

    const latitude = this._setState.run<number>(position.latitude);
    const longitude = this._setState.run<number>(position.longitude);
    if (latitude === undefined || longitude === undefined) {
      return undefined;
    }

    return new Position(
      latitude,
      longitude,
      new Date(position.createdAt),
      accuracy,
    );
  }
}
