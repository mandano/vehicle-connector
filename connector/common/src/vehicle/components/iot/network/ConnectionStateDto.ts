import StateDto from "../../state/StateDto.ts";

import ConnectionState from "./ConnectionState.ts";

export default class ConnectionStateDto {
  constructor(
    public readonly state: StateDto<
      typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
    >,
  ) {}
}
