import { Lock } from "../../Lock.ts";
import { Lock as LockComponent } from "../../../../../../../../../../connector/common/src/vehicle/components/lock/Lock.ts";
import { SendActionRequestInterface } from "../../../../../../../../../../connector/common/src/vehicle/model/actions/SendActionRequestInterface.ts";

export class LockBuilder {
  constructor(
    private readonly _sendActionRequest: SendActionRequestInterface,
  ) {}

  public build(lock: Lock): LockComponent {
    return new LockComponent(this._sendActionRequest, lock.state);
  }
}
