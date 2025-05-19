import { Imei } from "../components/iot/network/protocol/Imei.ts";
import { LockState } from "../components/lock/LockState.ts";

export class TransferLock {
  constructor(
    private _lock: LockState,
    private _trackingId: string,
    private _protocol: string,
    private _protocolVersion: string,
    private _imei: Imei,
  ) {}

  get lock(): LockState {
    return this._lock;
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
