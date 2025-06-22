import IotDto from "./IotDto.ts";
import IsPositionDto from "./position/IsPositionDto.ts";
import IsNetworkDto from "./network/IsNetworkDto.ts";

export default class IsIotDto {
  constructor(
    private readonly _isNetworkDto: IsNetworkDto,
    private readonly _isPositionDto: IsPositionDto,
  ) {}

  public run(ioT: unknown): ioT is IotDto {
    if (typeof ioT !== "object" || ioT === null) {
      return false;
    }

    if (!("network" in ioT) || !this._isNetworkDto.run(ioT.network)) {
      return false;
    }

    if (!("position" in ioT) || !this._isPositionDto.run(ioT.position)) {
      return false;
    }

    return true;
  }
}
