import TheSimpleProtocolLock from "../../../../../theSimpleProtocol/src/simulator/common/toConnector/lock/CreateMessageLine.ts";
import { THE_SIMPLE_PROTOCOL } from "../../../../../theSimpleProtocol/src/Protocol.ts";
import { TransferLock } from "../../../../../../../connector/common/src/vehicle/actions/TransferLock.ts";

import CreateMessageLineInterface from "./CreateMessageLineInterface.ts";

export class CreateMessageLine implements CreateMessageLineInterface {
  constructor(private readonly _theSimpleProtocolLock: TheSimpleProtocolLock) {}

  public run(lock: TransferLock): string | undefined {
    if (lock.protocol === THE_SIMPLE_PROTOCOL) {
      return this._theSimpleProtocolLock.run(lock);
    }

    return undefined;
  }
}
