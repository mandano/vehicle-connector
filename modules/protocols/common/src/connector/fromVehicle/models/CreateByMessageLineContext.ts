import { Unknown } from "../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { MessageLineContext } from "../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";
import { THE_SIMPLE_PROTOCOL } from "../../../../../theSimpleProtocol/src/Protocol.ts";
import { ToModelInterface as CreateTheSimpleProtocolInterface } from "../../../../../theSimpleProtocol/src/connector/common/models/ToModelInterface.ts";
import IsTheSimpleProtocol from "../../../../../theSimpleProtocol/src/IsProtocol.ts";

import { CreateByMessageLineContextInterface } from "./CreateByMessageLineContextInterface.ts";

export class CreateByMessageLineContext
  implements CreateByMessageLineContextInterface
{
  constructor(
    private _theSimpleProtocol: CreateTheSimpleProtocolInterface,
  ) {}

  public run(messageLineContext: MessageLineContext): Unknown | undefined {
    if (messageLineContext.paket === undefined) {
      return undefined;
    }

    if (
      messageLineContext.protocol === THE_SIMPLE_PROTOCOL &&
      messageLineContext.protocolVersion !== undefined &&
      IsTheSimpleProtocol.run(messageLineContext.paket)
    ) {
      return this._theSimpleProtocol.run(
        Unknown.name,
        messageLineContext.protocolVersion,
        messageLineContext.paket,
      );
    }

    return undefined;
  }
}

export default CreateByMessageLineContext;
