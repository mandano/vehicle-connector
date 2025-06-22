import ConnectionModule from "../../../../components/iot/network/ConnectionModule.ts";
import ConnectionModuleDto from "../../../../components/iot/network/ConnectionModuleDto.ts";
import ConnectionState from "../../../../components/iot/network/ConnectionState.ts";
import State from "../../../../State.ts";
import ConnectionStateDto from "../../../../components/iot/network/ConnectionStateDto.ts";

import SetState from "./SetState.ts";

export default class ConnectionModuleBuilder {
  constructor(private readonly _setState: SetState) {}

  public build(connectionModule: ConnectionModuleDto): ConnectionModule {
    let state: ConnectionState | undefined;

    if (connectionModule.state) {
      state = this.setConnectionState(connectionModule.state);
    }

    let detectedProtocolVersion: State<string> | undefined = undefined;

    if (connectionModule.detectedProtocolVersion) {
      detectedProtocolVersion = this._setState.run(
        connectionModule.detectedProtocolVersion,
      );
    }

    let setProtocolVersion: State<string> | undefined = undefined;

    if (connectionModule.setProtocolVersion) {
      setProtocolVersion = this._setState.run(
        connectionModule.setProtocolVersion,
      );
    }

    let detectedProtocol: State<string> | undefined = undefined;

    if (connectionModule.detectedProtocol) {
      detectedProtocol = this._setState.run(connectionModule.detectedProtocol);
    }

    let setProtocol: State<string> | undefined = undefined;

    if (connectionModule.setProtocol) {
      setProtocol = this._setState.run(connectionModule.setProtocol);
    }

    return new ConnectionModule(
      connectionModule.imei,
      state,
      detectedProtocolVersion,
      setProtocolVersion,
      detectedProtocol,
      setProtocol,
    );
  }

  private setConnectionState(
    stateDto: ConnectionStateDto,
  ): ConnectionState | undefined {
    const state = this._setState.run<
      typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
    >(stateDto.state);

    if (state === undefined) {
      return undefined;
    }

    return new ConnectionState(state);
  }
}
