import { MessageLineContext } from "../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";
import { THE_SIMPLE_PROTOCOL } from "../../../../theSimpleProtocol/src/Protocol.ts";

import { CreateByProtocolAndVersionInterface } from "./CreateByProtocolAndVersionInterface.ts";
import { CreatebyProtocolVersionInterface } from "./CreatebyProtocolVersionInterface.ts";

export class CreateByProtocolAndVersion
  implements CreateByProtocolAndVersionInterface
{
  constructor(private _theSimpleProtocol: CreatebyProtocolVersionInterface) {}

  public run(
    messageLine: string,
    protocol: string,
    protocolVersion: string,
  ): MessageLineContext | undefined {
    if (protocol === THE_SIMPLE_PROTOCOL) {
      return this._theSimpleProtocol.run(messageLine, protocolVersion);
    }

    return undefined;
  }
}

export default CreateByProtocolAndVersion;
