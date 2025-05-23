import LoggerInterface from "common/src/logger/LoggerInterface.ts";

import { Lock } from "../../../../../../common/src/vehicle/components/lock/Lock.ts";
import { ActionStateFromJsonInterface } from "../../../../../../common/src/vehicle/model/actions/json/ActionStateFromJsonInterface.ts";
import { OnMessageInterfaceV2 } from "../../../../../../common/src/adapters/queue/OnMessageInterfaceV2.ts";

export class HandleLockResponseV2 implements OnMessageInterfaceV2 {
  constructor(
    private _actionStateFromJson: ActionStateFromJsonInterface,
    private _logger: LoggerInterface,
  ) {}

  public async run(
    actionRequestAsString: string,
    options?: {
      vehicleId: number;
      targetState: typeof Lock.LOCKED | typeof Lock.UNLOCKED;
    },
  ): Promise<boolean | undefined> {
    this._logger.info(
      `Received action response: ${actionRequestAsString}`,
      HandleLockResponseV2.name,
    );

    const actionRequest = this._actionStateFromJson.run(actionRequestAsString);

    if (actionRequest === undefined) {
      return false;
    }

    if (
      options?.vehicleId === undefined ||
      actionRequest.vehicleId !== options?.vehicleId ||
      options?.targetState === undefined
    ) {
      return false;
    }

    return actionRequest.state === options?.targetState;
  }
}
