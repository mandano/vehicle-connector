import ConnectionModule from "../../../../components/iot/network/ConnectionModule.ts";
import ConnectionModuleDto from "../../../../components/iot/network/ConnectionModuleDto.ts";
import StateDto from "../../../../components/state/StateDto.ts";
import ConnectionStateDto from "../../../../components/iot/network/ConnectionStateDto.ts";

import SetStateDto from "./SetStateDto.ts";

export default class ConnectionModuleBuilder {
  constructor(private readonly _setStateDto: SetStateDto) {}

  public build(connectionModule: ConnectionModule): ConnectionModuleDto {
    let stateDto: ConnectionStateDto | undefined;

    if (connectionModule.state) {
      stateDto = new ConnectionStateDto(
        this._setStateDto.run(connectionModule.state.state),
      );
    }

    let detectedProtocolVersion: StateDto<string> | undefined = undefined;

    if (connectionModule.detectedProtocolVersion) {
      detectedProtocolVersion = this._setStateDto.run(
        connectionModule.detectedProtocolVersion,
      );
    }

    let setProtocolVersion: StateDto<string> | undefined = undefined;

    if (connectionModule.setProtocolVersion) {
      setProtocolVersion = this._setStateDto.run(
        connectionModule.setProtocolVersion,
      );
    }

    let detectedProtocol: StateDto<string> | undefined = undefined;

    if (connectionModule.detectedProtocol) {
      detectedProtocol = this._setStateDto.run(
        connectionModule.detectedProtocol,
      );
    }

    let setProtocol: StateDto<string> | undefined = undefined;

    if (connectionModule.setProtocol) {
      setProtocol = this._setStateDto.run(connectionModule.setProtocol);
    }

    return new ConnectionModuleDto(
      connectionModule.imei,
      stateDto,
      detectedProtocolVersion,
      setProtocolVersion,
      detectedProtocol,
      setProtocol,
    );
  }
}
