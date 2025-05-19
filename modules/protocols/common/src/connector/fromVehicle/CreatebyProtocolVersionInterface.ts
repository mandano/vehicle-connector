import { MessageLineContext } from "../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";

export interface CreatebyProtocolVersionInterface {
  run(
    messageLine: string,
    protocolVersion: string,
  ): MessageLineContext | undefined;
}
