import {Lock} from "../../../../src/vehicle/components/lock/Lock.ts";
import {FakeSendActionRequest} from "../../model/actions/FakeSendActionRequest.ts";
import {State} from "../../../../src/vehicle/State.ts";

export class CreateLock {
  public run() {
    return new Lock(
      new FakeSendActionRequest(),
      new State(
        [Lock.LOCKED, Lock.UNLOCKED][Math.random() < 0.5 ? 1 : 0],
        new Date(),
        undefined,
        new Date()
      )
    );
  }
}