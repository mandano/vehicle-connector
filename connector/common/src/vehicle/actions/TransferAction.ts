import { Imei } from "../components/iot/network/protocol/Imei.ts";

import { Actions } from "./Actions.ts";

export class TransferAction {
  constructor(
    private _action: Actions,
    private _trackingId: string,
    private _protocol: string,
    private _protocolVersion: string,
    private _imei: Imei,
  ) {}

  get action(): Actions {
    return this._action;
  }

  get trackingId(): string {
    return this._trackingId;
  }

  get protocol(): string {
    return this._protocol;
  }

  get protocolVersion(): string {
    return this._protocolVersion;
  }

  get imei(): Imei {
    return this._imei;
  }
}

export default TransferAction;
