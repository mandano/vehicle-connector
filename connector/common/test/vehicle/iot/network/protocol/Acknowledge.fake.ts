import { AcknowledgeInterface } from "../../../../../src/vehicle/components/iot/network/protocol/AcknowledgeInterface.ts";
import { MessageLineContext } from "../../../../../src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";

export class Acknowledge implements AcknowledgeInterface {
  constructor(private _runReturnValue: boolean | undefined = true) {
  }

  run(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socketId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messageLine: MessageLineContext,
  ): Promise<boolean | undefined> {
    return Promise.resolve(this._runReturnValue);
  }
}
