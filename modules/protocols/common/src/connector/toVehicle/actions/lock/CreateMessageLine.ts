import { THE_SIMPLE_PROTOCOL } from "../../../../../../theSimpleProtocol/src/Protocol.ts";
import { TransferLock } from "../../../../../../../../connector/common/src/vehicle/actions/TransferLock.ts";
import TheSimpleProtocol from "../../../../../../theSimpleProtocol/src/connector/common/toVehicle/actions/lock/ToMessageLine.ts";

import CreateMessageLineInterface from "./CreateMessageLineInterface.ts";

class CreateMessageLine implements CreateMessageLineInterface {
  constructor(private _theSimpleProtocol: TheSimpleProtocol) {}

  public run(lock: TransferLock): string | undefined {
    if (lock.protocol === THE_SIMPLE_PROTOCOL) {
      return this._theSimpleProtocol.run(lock);
    }

    return undefined;
  }
}

export default CreateMessageLine;
