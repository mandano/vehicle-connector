import { CreateByProtocolAndVersionInterface } from "../../../modules/protocols/common/src/simulator/fromConnector/messageLineContext/CreateByProtocolAndVersionInterface.ts";
import CreateMessageLineFromLockInterface from "../../../modules/protocols/common/src/simulator/pakets/lock/CreateMessageLineInterface.ts";
import CreateMessageLinesInterface from "../../../modules/protocols/common/src/simulator/toConnector/update/CreateMessageLinesInterface.ts";
import CreateActionInterface
  from "../../../modules/protocols/common/src/simulator/toConnector/update/action/CreateActionInterface.ts";

interface ContextInterface {
  get createMessageLineContextByProtocolAndVersion(): CreateByProtocolAndVersionInterface;
  get createMessageLines(): CreateMessageLinesInterface;
  get lockToMessageLine(): CreateMessageLineFromLockInterface;
  get createAction(): CreateActionInterface;
}

export default ContextInterface;
