import ProtocolsCommonContext from "../../../modules/protocols/common/src/_Context.ts";
import { CreateByProtocolAndVersionInterface } from "../../../modules/protocols/common/src/simulator/fromConnector/messageLineContext/CreateByProtocolAndVersionInterface.ts";
import CreateMessageLineFromLockInterface from "../../../modules/protocols/common/src/simulator/pakets/lock/CreateMessageLineInterface.ts";
import CreateMessageLinesInterface from "../../../modules/protocols/common/src/simulator/toConnector/update/CreateMessageLinesInterface.ts";
import CreateActionInterface from "../../../modules/protocols/common/src/simulator/toConnector/update/action/CreateActionInterface.ts";

import ContextInterface from "./ContextInterface.ts";

class Context implements ContextInterface {
  constructor(private _protocolsCommon: ProtocolsCommonContext) {}

  get createMessageLineContextByProtocolAndVersion(): CreateByProtocolAndVersionInterface {
    return this._protocolsCommon.simulator.fromConnector.messageLineContext
      .create;
  }

  get createMessageLines(): CreateMessageLinesInterface {
    return this._protocolsCommon.simulator.toConnector.update
      .createMessageLines;
  }

  get lockToMessageLine(): CreateMessageLineFromLockInterface {
    return this._protocolsCommon.simulator.pakets.lock.lockToMessageLine;
  }

  get createAction(): CreateActionInterface {
    return this._protocolsCommon.simulator.toConnector.update.action
      .createAction;
  }
}

export default Context;
