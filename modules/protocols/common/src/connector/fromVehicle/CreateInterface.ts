import { MessageLineContext } from "../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";

interface Create {
  run(messageLine: string): MessageLineContext | undefined;
}

export default Create;