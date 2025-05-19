import Actions from "../../Actions.ts";
import Protocols from "../../Protocols.ts"

// TODO: try to merge with other existing MessageLineContext object
export class MessageLineContext {
  constructor(
    private _protocol: Protocols,
    private _paket: Actions,
    private _protocolVersion: string,
    private _trackingId?: string,
  ) {}

  get protocol(): string {
    return this._protocol;
  }

  set protocol(value: Protocols) {
    this._protocol = value;
  }

  get paket(): Actions {
    return this._paket;
  }

  set paket(value: Actions) {
    this._paket = value;
  }

  get protocolVersion(): string {
    return this._protocolVersion;
  }

  set protocolVersion(value: string) {
    this._protocolVersion = value;
  }

  get trackingId(): string | undefined {
    return this._trackingId;
  }
}
