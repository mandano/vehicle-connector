import ConnectionModuleDto from "../../../components/iot/network/ConnectionModuleDto.ts";
import StateDto from "../../../components/state/StateDto.ts";
import ConnectionStateDto from "../../../components/iot/network/ConnectionStateDto.ts";
import IsConnectionStateDto from "../../../components/iot/network/IsConnectionStateDto.ts";
import IsConnectionModuleDto from "../../../components/iot/network/IsConnectionModuleDto.ts";
import ConnectionState from "../../../components/iot/network/ConnectionState.ts";
import IsStringStateDto from "../../../components/state/IsStringStateDto.ts";

import SetStateDto from "./SetStateDto.ts";

export default class ConnectionModuleBuilder {
  constructor(
    private readonly _setStateDto: SetStateDto,
    private readonly _isStringStateDto: IsStringStateDto,
    private readonly _isConnectionStateDto: IsConnectionStateDto,
    private readonly _isConnectionModuleDto: IsConnectionModuleDto,
  ) {}

  public build(connectionModule: unknown): ConnectionModuleDto | undefined {
    let connectionStateDto: ConnectionStateDto | undefined;

    if (!this._isConnectionModuleDto.run(connectionModule)) {
      return undefined;
    }

    if (connectionModule.state) {
      connectionStateDto = this.setState(connectionModule.state);
    }

    let detectedProtocolVersion: StateDto<string> | undefined = undefined;

    if (
      connectionModule.detectedProtocolVersion &&
      this._isStringStateDto.run(connectionModule.detectedProtocolVersion)
    ) {
      detectedProtocolVersion = this._setStateDto.run<string>(
        connectionModule.detectedProtocolVersion,
      );
    }

    let setProtocolVersion: StateDto<string> | undefined = undefined;

    if (
      connectionModule.setProtocolVersion &&
      this._isStringStateDto.run(connectionModule.setProtocolVersion)
    ) {
      setProtocolVersion = this._setStateDto.run<string>(
        connectionModule.setProtocolVersion,
      );
    }

    let detectedProtocol: StateDto<string> | undefined = undefined;

    if (
      connectionModule.detectedProtocol &&
      this._isStringStateDto.run(connectionModule.detectedProtocol)
    ) {
      detectedProtocol = this._setStateDto.run<string>(
        connectionModule.detectedProtocol,
      );
    }

    let setProtocol: StateDto<string> | undefined = undefined;

    if (
      connectionModule.setProtocol &&
      this._isStringStateDto.run(connectionModule.setProtocol)
    ) {
      setProtocol = this._setStateDto.run<string>(connectionModule.setProtocol);
    }

    return new ConnectionModuleDto(
      connectionModule.imei,
      connectionStateDto,
      detectedProtocolVersion,
      setProtocolVersion,
      detectedProtocol,
      setProtocol,
    );
  }

  private setState(state: unknown): ConnectionStateDto | undefined {
    if (!this._isConnectionStateDto.run(state)) {
      return undefined;
    }

    const stateDto = this._setStateDto.run<
      typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
    >(state.state);

    if (stateDto === undefined) {
      return undefined;
    }

    return new ConnectionStateDto(stateDto);
  }
}
