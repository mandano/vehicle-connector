import IsStateDto from "../../state/IsStateDto.ts";

import ConnectionStateDto from "./ConnectionStateDto.ts";
import ConnectionState from "./ConnectionState.ts";

export default class IsConnectionStateDto {
  constructor(private readonly _isStateDto: IsStateDto) {}

  public run(
    connectionStateDto: unknown,
  ): connectionStateDto is ConnectionStateDto {
    if (typeof connectionStateDto !== "object" || connectionStateDto === null) {
      return false;
    }

    if (
      !("state" in connectionStateDto) ||
      !this._isStateDto.run(connectionStateDto.state)
    ) {
      return false;
    }

    return (
      connectionStateDto.state.state === ConnectionState.CONNECTED ||
      connectionStateDto.state.state === ConnectionState.DISCONNECTED
    );
  }
}
