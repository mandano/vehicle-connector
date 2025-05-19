import {
  MessageLineContext
} from "../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";

export interface CreateInterface {
  run(messageLine: string): MessageLineContext | undefined;
}