import { LockState } from "../components/lock/LockState.ts";
import { PublishAction } from "../../../../../modules/protocols/common/src/connector/toVehicle/actions/PublishAction.ts";
import CreateMessageLineForLockActionInterface from "../../../../../modules/protocols/common/src/connector/toVehicle/actions/lock/CreateMessageLineInterface.ts";

import { TransferAction } from "./TransferAction.ts";
import { TransferLock } from "./TransferLock.ts";

export class SendAction {
  constructor(
    private _publishAction: PublishAction,
    private _createMessageLineForLockAction: CreateMessageLineForLockActionInterface,
  ) {}

  public async run(action: TransferAction): Promise<boolean> {
    if (action.action instanceof LockState) {
      const messageLine = this._createMessageLineForLockAction.run(
        new TransferLock(
          action.action,
          action.trackingId,
          action.protocol,
          action.protocolVersion,
          action.imei,
        ),
      );

      if (messageLine === undefined) {
        return false;
      }

      return await this._publishAction.run(action, messageLine);
    }

    return false;
  }
}

export default SendAction;
