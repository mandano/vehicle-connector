import LoggerInterface from "../../../logger/LoggerInterface.ts";

import IotDto from "./IotDto.ts";
import IsPositionDto from "./position/IsPositionDto.ts";
import IsNetworkDto from "./network/IsNetworkDto.ts";

export default class IsIotDto {
  constructor(
    private readonly _logger: LoggerInterface,
    private readonly _isNetworkDto: IsNetworkDto,
    private readonly _isPositionDto: IsPositionDto,
  ) {}

  public run(ioT: unknown): ioT is IotDto {
    this._logger.debug(`Validating ioT ${JSON.stringify(ioT)}`, IsIotDto.name);

    if (typeof ioT !== "object" || ioT === null) {
      this._logger.debug(`ioT is not an object`, IsIotDto.name);

      return false;
    }

    if (!("network" in ioT) && !("position" in ioT)) {
      this._logger.debug(`ioT is empty`, IsIotDto.name);

      return false;
    }

    if (("network" in ioT) && !this._isNetworkDto.run(ioT.network)) {
      this._logger.debug(`ioT.network is invalid`, IsIotDto.name);

      return false;
    }

    if (("position" in ioT) && !this._isPositionDto.run(ioT.position)) {
      this._logger.debug(`ioT.position is invalid`, IsIotDto.name);

      return false;
    }

    return true;
  }
}
