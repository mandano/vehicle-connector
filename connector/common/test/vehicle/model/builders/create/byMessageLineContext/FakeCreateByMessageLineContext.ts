import { CreateByMessageLineContextInterface } from "../../../../../../../../modules/protocols/common/src/connector/fromVehicle/models/CreateByMessageLineContextInterface.ts";
import { MessageLineContext } from "../../../../../../src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";
import { Unknown } from "../../../../../../src/vehicle/model/models/Unknown.ts";

export class FakeCreateByMessageLineContext
  implements CreateByMessageLineContextInterface
{
  private _runReturnValue: Unknown | undefined;

  constructor(runReturnValue: Unknown | undefined) {
    this._runReturnValue = runReturnValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(messageLine: MessageLineContext): Unknown | undefined {
    return this._runReturnValue;
  }
}
