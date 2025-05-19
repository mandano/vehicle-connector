import { Lock } from "../../../../../common/src/vehicle/components/lock/Lock.ts";
import { ActionState } from "../../../../../common/src/vehicle/model/actions/ActionState.ts";
import { ActionStateTypes } from "../../../../../common/src/vehicle/model/actions/ActionStateTypes.ts";
import { ActionStateToJson } from "../../../../../common/src/vehicle/model/actions/json/ActionStateToJson.ts";
import { ExchangeInterface } from "../../../../../common/src/adapters/queue/ExchangeInterface.ts";

import { ForwardToActionResponsesInterface } from "./ForwardToActionResponsesInterface.ts";

export class ForwardToActionResponses
  implements ForwardToActionResponsesInterface
{
  constructor(private _toActionResponses: ExchangeInterface) {}

  public async run(
    lockState: typeof Lock.UNLOCKED | typeof Lock.LOCKED,
    vehicleId: number,
  ): Promise<boolean | undefined> {
    const actionRequest = new ActionState(
      lockState,
      "",
      new Date(),
      vehicleId,
      lockState === Lock.LOCKED
        ? ActionStateTypes.LOCK
        : ActionStateTypes.UNLOCK,
    );

    const actionAsJson = ActionStateToJson.run(actionRequest);

    return await this._toActionResponses.publish(actionAsJson);
  }
}
