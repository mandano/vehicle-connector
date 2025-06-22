import State from "../../../State.ts";

import type Imei from "./protocol/Imei.ts";
import ConnectionState from "./ConnectionState.ts";

export class ConnectionModule {
  constructor(
    private readonly _imei: Imei,
    private _state: ConnectionState | undefined = undefined,
    private _detectedProtocolVersion: State<string> | undefined = undefined,
    private _setProtocolVersion: State<string> | undefined = undefined,
    private _detectedProtocol: State<string> | undefined = undefined,
    private _setProtocol: State<string> | undefined = undefined,
  ) {}

  get imei(): Imei {
    return this._imei;
  }

  get state(): ConnectionState | undefined {
    return this._state;
  }

  set state(state: ConnectionState | undefined) {
    this._state = state;
  }

  get detectedProtocolVersion(): State<string> | undefined {
    return this._detectedProtocolVersion;
  }

  set detectedProtocolVersion(
    detectedProtocolVersion: State<string> | undefined,
  ) {
    this._detectedProtocolVersion = detectedProtocolVersion;
  }

  public setToConnected(): void {
    if (this._state === undefined) {
      return;
    }

    this._state.state.state = ConnectionState.CONNECTED;
    this._state.state.originatedAt = new Date();
  }

  public setToDisconnected(): void {
    if (this._state === undefined) {
      return;
    }

    this._state.state.state = ConnectionState.DISCONNECTED;
    this._state.state.originatedAt = new Date();
  }

  get setProtocolVersion(): State<string> | undefined {
    return this._setProtocolVersion;
  }

  set setProtocolVersion(setProtocolVersion: State<string> | undefined) {
    this._setProtocolVersion = setProtocolVersion;
  }

  get setProtocol(): State<string> | undefined {
    return this._setProtocol;
  }

  set setProtocol(setProtocol: State<string> | undefined) {
    this._setProtocol = setProtocol;
  }

  get detectedProtocol(): State<string> | undefined {
    return this._detectedProtocol;
  }

  set detectedProtocol(detectedProtocol: State<string> | undefined) {
    this._detectedProtocol = detectedProtocol;
  }
}

export default ConnectionModule;
