import { Vehicle } from "../../../../connector/common/src/vehicle/Vehicle.ts";
import { OnLockRequest } from "../../adapters/tcpClient/onData/OnLockRequest.ts";
import { LockState } from "../../../../connector/common/src/vehicle/components/lock/LockState.ts";
import { AdHocUpdate } from "../adHocUpdate/AdHocUpdate.ts";
import { TriggerAdHocUpdate } from "../adHocUpdate/TriggerAdHocUpdate.ts";
import { MessageLineContext } from "../../../../modules/protocols/common/src/simulator/actions/MessageLineContext.ts";

export class ReactToAction {
  constructor(
    private _onLockRequest: OnLockRequest,
    private _adHocUpdate: TriggerAdHocUpdate,
  ) {}
  public async run(
    action: LockState,
    vehicle: Vehicle,
    messageLineContext: MessageLineContext,
  ): Promise<boolean | undefined> {
    if (action instanceof LockState) {
      this._onLockRequest.run(vehicle, action);

      const adHocUpdate = new AdHocUpdate(
        vehicle.id,
        messageLineContext.trackingId ?? "",
        messageLineContext.protocolVersion,
        messageLineContext.protocol,
        "lock",
      );

      return await this._adHocUpdate.run(adHocUpdate);
    }
  }
}
