import { MessageLineContext } from "../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";

export interface CreateByProtocolAndVersionInterface {
  run(
    messageLine: string,
    protocol: string,
    protocolVersion: string,
  ): MessageLineContext | undefined;
}

export default CreateByProtocolAndVersionInterface;