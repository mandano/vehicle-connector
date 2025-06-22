import LockState from "common/src/vehicle/components/lock/LockState.ts";

import LockPaket from "../../Lock.ts";
import Lock from "../../../../../../../../../../connector/common/src/vehicle/components/lock/Lock.ts";
import { SendActionRequestInterface } from "../../../../../../../../../../connector/common/src/vehicle/model/actions/SendActionRequestInterface.ts";

export class LockBuilder {
  constructor(
    private readonly _sendActionRequest: SendActionRequestInterface,
  ) {}

  public build(lock: LockPaket): Lock {
    return new Lock(
      this._sendActionRequest,
      new LockState(lock.state),
    );
  }
}
