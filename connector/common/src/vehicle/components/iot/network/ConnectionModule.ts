import { State } from "../../../State.ts";

import { Imei } from "./protocol/Imei.ts";

export class ConnectionModule {
  public static readonly CONNECTED = "connected";
  public static readonly DISCONNECTED = "disconnected";

  private readonly _imei: Imei;
  private _state:
    | State<
        typeof ConnectionModule.CONNECTED | typeof ConnectionModule.DISCONNECTED
      >
    | undefined;
  private _detectedProtocolVersion: State<string> | undefined;
  private _setProtocolVersion: State<string> | undefined;
  private _detectedProtocol: State<string> | undefined;
  private _setProtocol: State<string> | undefined;

  constructor(
    imei: Imei,
    state:
      | State<
          | typeof ConnectionModule.CONNECTED
          | typeof ConnectionModule.DISCONNECTED
        >
      | undefined = undefined,
    detectedProtocolVersion: State<string> | undefined = undefined,
    setProtocolVersion: State<string> | undefined = undefined,
    detectedProtocol: State<string> | undefined = undefined,
    setProtocol: State<string> | undefined = undefined
  ) {
    this._imei = imei;
    this._state = state;
    this._detectedProtocolVersion = detectedProtocolVersion;
    this._setProtocolVersion = setProtocolVersion;
    this._detectedProtocol = detectedProtocol;
    this._setProtocol = setProtocol;
  }

  get imei(): Imei {
    return this._imei;
  }

  get state():
    | State<
        typeof ConnectionModule.CONNECTED | typeof ConnectionModule.DISCONNECTED
      >
    | undefined {
    return this._state;
  }

  set state(
    state:
      | State<
      | typeof ConnectionModule.CONNECTED
      | typeof ConnectionModule.DISCONNECTED
    >
      | undefined,
  ) {
    this._state = state;
  }

  get detectedProtocolVersion(): State<string> | undefined {
    return this._detectedProtocolVersion;
  }

  set detectedProtocolVersion(detectedProtocolVersion: State<string> | undefined) {
    this._detectedProtocolVersion = detectedProtocolVersion;
  }

  public setToConnected(): void {
    if (this._state === undefined) {
      return;
    }

    this._state.state = ConnectionModule.CONNECTED;
    this._state.originatedAt = new Date();
  }

  public setToDisconnected(): void {
    if (this._state === undefined) {
      return;
    }

    this._state.state = ConnectionModule.DISCONNECTED;
    this._state.originatedAt = new Date();
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
