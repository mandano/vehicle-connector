import ConnectionModuleDto from "./ConnectionModuleDto.ts";
import IsConnectionStateDto from "./IsConnectionStateDto.ts";

export default class IsConnectionModuleDto {
  constructor(private readonly _isConnectionStateDto: IsConnectionStateDto) {}

  public run(
    connectionModuleDto: unknown,
  ): connectionModuleDto is ConnectionModuleDto {
    if (
      typeof connectionModuleDto !== "object" ||
      connectionModuleDto === null
    ) {
      return false;
    }

    if (!("state" in connectionModuleDto)) {
      return false;
    }

    return this._isConnectionStateDto.run(connectionModuleDto.state) === true;
  }
}
