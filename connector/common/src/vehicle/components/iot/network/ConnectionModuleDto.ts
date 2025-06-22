import StateDto from "../../state/StateDto.ts";

import type Imei from "./protocol/Imei.ts";
import ConnectionStateDto from "./ConnectionStateDto.ts";

export default class ConnectionModuleDto {
  constructor(
    public readonly imei: Imei,
    public readonly state: ConnectionStateDto | undefined = undefined,
    public readonly detectedProtocolVersion:
      | StateDto<string>
      | undefined = undefined,
    public readonly setProtocolVersion:
      | StateDto<string>
      | undefined = undefined,
    public readonly detectedProtocol: StateDto<string> | undefined = undefined,
    public readonly setProtocol: StateDto<string> | undefined = undefined,
  ) {}
}
