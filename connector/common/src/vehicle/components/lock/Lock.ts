import ActionState from "../../model/actions/ActionState.ts";
import SendActionRequestInterface from "../../model/actions/SendActionRequestInterface.ts";
import ActionStateTypes from "../../model/actions/ActionStateTypes.ts";

import LockState from "./LockState.ts";

export class Lock {
  public static LOCKED = "locked";
  public static UNLOCKED = "unlocked";

  constructor(
    private _sendActionRequest?: SendActionRequestInterface,
    private _state?: LockState | undefined,
  ) {}

  get state(): LockState | undefined {
    return this._state;
  }

  set state(state: LockState | undefined) {
    this._state = state;
  }

  public async lock(trackingId: string, vehicleId: number): Promise<boolean> {
    if (!this._sendActionRequest) {
      return false;
    }

    const forwardedActionRequest = await this._sendActionRequest.run(
      new ActionState(
        Lock.LOCKED,
        trackingId,
        new Date(),
        vehicleId,
        ActionStateTypes.LOCK,
      ),
    );

    return forwardedActionRequest === true;
  }

  public async unlock(trackingId: string, vehicleId: number): Promise<boolean> {
    if (!this._sendActionRequest) {
      return false;
    }

    const forwardedActionRequest = await this._sendActionRequest.run(
      new ActionState(
        Lock.UNLOCKED,
        trackingId,
        new Date(),
        vehicleId,
        ActionStateTypes.UNLOCK,
      ),
    );

    return forwardedActionRequest === true;
  }

  public lockingSupported(): boolean {
    return this._sendActionRequest !== undefined;
  }

  public unlockingSupported(): boolean {
    return this._sendActionRequest !== undefined;
  }
}

export default Lock;
