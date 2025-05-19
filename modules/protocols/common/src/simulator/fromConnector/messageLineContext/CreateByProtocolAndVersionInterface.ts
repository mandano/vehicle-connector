import { MessageLineContext } from "../../actions/MessageLineContext.ts";

export interface CreateByProtocolAndVersionInterface {
  run(
    messageLine: string,
    protocol: string,
    protocolVersion: string,
  ): MessageLineContext | undefined;
}

export default CreateByProtocolAndVersionInterface;
