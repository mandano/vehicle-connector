import { State } from "../../State.ts";
import { ActionState } from "../../model/actions/ActionState.ts";
import { SendActionRequestInterface } from "../../model/actions/SendActionRequestInterface.ts";
import { ActionStateTypes } from "../../model/actions/ActionStateTypes.ts";

export class Lock {
  public static LOCKED = "locked";
  public static UNLOCKED = "unlocked";

  private _state?: State<typeof Lock.LOCKED | typeof Lock.UNLOCKED>;
  private _sendActionRequest: SendActionRequestInterface;

  constructor(
    sendActionRequest: SendActionRequestInterface,
    state?: State<typeof Lock.LOCKED | typeof Lock.UNLOCKED> | undefined,
  ) {
    this._sendActionRequest = sendActionRequest;
    this._state = state;
  }

  get state(): State<typeof Lock.LOCKED | typeof Lock.UNLOCKED> | undefined {
    return this._state;
  }

  set state(
    state: State<typeof Lock.LOCKED | typeof Lock.UNLOCKED> | undefined,
  ) {
    this._state = state;
  }

  public async lock(trackingId: string, vehicleId: number): Promise<boolean> {
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
}
