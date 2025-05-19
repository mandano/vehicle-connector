import CreateActionInterface from "../../../../../../common/src/simulator/toConnector/update/action/CreateActionInterface.ts";
import { LockState } from "../../../../../../../../connector/common/src/vehicle/components/lock/LockState.ts";
import { State } from "../../../../../../../../connector/common/src/vehicle/State.ts";
import { Lock } from "../../../../connector/0_1/pakets/lock/Lock.ts";

class CreateAction implements CreateActionInterface {
  run(paket: Lock): LockState | undefined {
    if (paket.state.state === LockState.LOCKED) {
      return new LockState(
        new State(
          LockState.LOCKED,
          paket.state.originatedAt,
          paket.state.updatedAt,
          paket.state.createdAt,
        ),
      );
    } else if (paket.state.state === LockState.UNLOCKED) {
      return new LockState(
        new State(
          LockState.UNLOCKED,
          paket.state.originatedAt,
          paket.state.updatedAt,
          paket.state.createdAt,
        ),
      );
    }
    return undefined;
  }
}

export default CreateAction;
