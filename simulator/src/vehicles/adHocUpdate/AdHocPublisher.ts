import Vehicle from "../../../../connector/common/src/vehicle/Vehicle.ts";

import { AdHocUpdate } from "./AdHocUpdate.ts";
import { SendLock } from "./SendLock.ts";

export class AdHocPublisher {
  constructor(private _sendLock: SendLock) {}

  public async run(
    adHocUpdate: AdHocUpdate,
    vehicle: Vehicle,
  ): Promise<boolean | undefined> {
    if (adHocUpdate.paketType === "lock") {
      return await this._sendLock.run(vehicle, adHocUpdate.trackingId);
    }

    return undefined;
  }
}
