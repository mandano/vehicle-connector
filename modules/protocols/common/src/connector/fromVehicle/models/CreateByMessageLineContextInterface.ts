import { Unknown } from "../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { MessageLineContext } from "../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";

export interface CreateByMessageLineContextInterface {
  run(messageLineContext: MessageLineContext): Unknown | undefined;
}

export default CreateByMessageLineContextInterface;
