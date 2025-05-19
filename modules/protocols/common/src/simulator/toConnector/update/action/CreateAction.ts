import { LockState } from "../../../../../../../../connector/common/src/vehicle/components/lock/LockState.ts";
import Actions from "../../../../Actions.ts";

import CreateActionInterface from "./CreateActionInterface.ts";

class CreateAction implements CreateActionInterface {
  constructor(
    public readonly _createTheSimpleProtocol: CreateActionInterface,
  ) {}

  run(paket: Actions): LockState | undefined {
    return this._createTheSimpleProtocol.run(paket);
  }
}

export default CreateAction;
