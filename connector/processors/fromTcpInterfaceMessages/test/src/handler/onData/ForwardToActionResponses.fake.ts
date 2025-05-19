import { ForwardToActionResponsesInterface } from "../../../../src/handler/onData/ForwardToActionResponsesInterface.ts";
import { Lock } from "../../../../../../common/src/vehicle/components/lock/Lock.ts";

export class ForwardToActionResponses
  implements ForwardToActionResponsesInterface
{
  private _forwardedStates = new Map<
    number,
    typeof Lock.UNLOCKED | typeof Lock.LOCKED
  >();

  public async run(
    lockState: typeof Lock.UNLOCKED | typeof Lock.LOCKED,
    vehicleId: number,
  ): Promise<boolean | undefined> {
    this._forwardedStates.set(vehicleId, lockState);

    return true;
  }

  get forwardedStates(): Map<number, typeof Lock.UNLOCKED | typeof Lock.LOCKED> {
    return this._forwardedStates;
  }
}
