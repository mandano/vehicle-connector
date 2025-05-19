import { ValidateInterface } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/ValidateInterface.ts";
import { MessageLineSplitterInterface } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/MessageLineSplitterInterface.ts";
import { Lock } from "../Lock.ts";
import { LockState } from "../../../../../../../../../connector/common/src/vehicle/components/lock/LockState.ts";
import { State } from "../../../../../../../../../connector/common/src/vehicle/State.ts";

/**
 * T_S_P;0_1;13456789;LOCK;2021-01-01T00:00:00.000Z;lock=UNLOCKED,lockOriginatedAt=2021-01-01T00:00:00.000Z,123456
 */
export class CreateLock {
  private _validate: ValidateInterface;
  private _messageLineSplitter: MessageLineSplitterInterface;

  constructor(
    validate: ValidateInterface,
    messageLineSplitter: MessageLineSplitterInterface,
  ) {
    this._validate = validate;
    this._messageLineSplitter = messageLineSplitter;
  }

  public run(messageLine: string): Lock | undefined {
    const items = this._messageLineSplitter.run(messageLine);

    if (items === undefined) {
      return undefined;
    }

    if (!this._validate.run(items)) {
      return undefined;
    }

    const lockState = new LockState(
      new State(items[5], new Date(items[6]), undefined, new Date()),
    );

    return new Lock(lockState, items[7], items[1], items[2]);
  }
}

export default CreateLock;
