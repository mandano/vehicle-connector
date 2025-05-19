import Protocols from "../../../../../../../../../modules/protocols/common/src/Protocols.ts"
import Pakets from "../../../../../../../../../modules/protocols/common/src/Pakets.ts"
import Imei from "../Imei.ts";

export class MessageLineContext {
  constructor(
    private _protocol?: Protocols | undefined,
    private _paket?: Pakets | undefined,
    private _protocolVersion?: string | undefined,
    private _trackingId?: string,
    private _imei?: Imei,
  ) {}

  get protocol(): string | undefined {
    return this._protocol;
  }

  set protocol(value: Protocols) {
    this._protocol = value;
  }

  get paket(): Pakets | undefined {
    return this._paket;
  }

  set paket(value: Pakets) {
    this._paket = value;
  }

  get protocolVersion(): string | undefined {
    return this._protocolVersion;
  }

  set protocolVersion(value: string) {
    this._protocolVersion = value;
  }

  get trackingId(): string | undefined {
    return this._trackingId;
  }

  get imei(): Imei | undefined {
    return this._imei;
  }
}

export default MessageLineContext;
