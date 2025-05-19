import CreateActionInterface from "../../../../../common/src/simulator/toConnector/update/action/CreateActionInterface.ts";
import { LockState } from "../../../../../../../connector/common/src/vehicle/components/lock/LockState.ts";
import { Lock } from "../../../connector/0_1/pakets/lock/Lock.ts";
import { Actions } from "../../../paketTypes.ts";

import CreateLock from "./lock/CreateAction.ts";

class CreateAction implements CreateActionInterface {
  constructor(private readonly createLock: CreateLock) {}

  run(paket: Actions): LockState | undefined {
    if (paket instanceof Lock) {
      return this.createLock.run(paket);
    }

    return undefined;
  }
}

export default CreateAction;
