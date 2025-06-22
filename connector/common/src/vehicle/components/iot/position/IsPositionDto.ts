import IsNumberStateDto from "../../state/IsNumberStateDto.ts";

import PositionDto from "./PositionDto.ts";

export default class IsPositionDto {
  constructor(private readonly _isNumberStateDto: IsNumberStateDto) {}

  public run(position: unknown): position is PositionDto {
    if (typeof position !== "object" || position === null) {
      return false;
    }

    if (
      !("latitude" in position) ||
      !("longitude" in position) ||
      !("createdAt" in position)
    ) {
      return false;
    }

    if (typeof position.latitude !== "object" || position.latitude === null) {
      return false;
    }

    const latitude = (position as PositionDto).latitude;
    if (this._isNumberStateDto.run(latitude) === false) {
      return false;
    }

    if (typeof position.longitude !== "object" || position.longitude === null) {
      return false;
    }

    const longitude = (position as PositionDto).longitude;
    if (this._isNumberStateDto.run(longitude) === false) {
      return false;
    }

    if (typeof position.createdAt !== "string") {
      return false;
    }

    return true;
  }
}
