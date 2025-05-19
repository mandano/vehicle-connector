import Actions from "../../../../Actions.ts";
import { LockState } from "../../../../../../../../connector/common/src/vehicle/components/lock/LockState.ts";

interface CreateActionInterface {
  run(paket: Actions): LockState | undefined;
}

export default CreateActionInterface;
