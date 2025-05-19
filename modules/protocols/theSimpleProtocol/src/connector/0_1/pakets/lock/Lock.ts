import { State } from "../../../../../../../../connector/common/src/vehicle/State.ts";
import { LockState } from "../../../../../../../../connector/common/src/vehicle/components/lock/LockState.ts";
import { Imei } from "../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/Imei.ts";

export class Lock {
  public static messageLineKey = "LOCK";

  constructor(
    private _state: LockState,
    private _trackingId: string,
    private _protocolVersion: string,
    private _imei: Imei,
  ) {}

  get state(): State<typeof LockState.LOCKED | typeof LockState.UNLOCKED> {
    return this._state.state;
  }

  get trackingId(): string {
    return this._trackingId;
  }

  get protocolVersion(): string {
    return this._protocolVersion;
  }

  get imei(): Imei {
    return this._imei;
  }
}

export default Lock;
