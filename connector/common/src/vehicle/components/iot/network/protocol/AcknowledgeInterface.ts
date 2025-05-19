import { MessageLineContext } from "./messageLineContext/MessageLineContext.ts";

export interface AcknowledgeInterface {
  run(socketId: string, messageLine: MessageLineContext): Promise<boolean | undefined>;
}
