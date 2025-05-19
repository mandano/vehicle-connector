import { OnMessageInterface } from "./OnMessageInterface.ts";

export interface WorkerQueueInterface {
  send(message: string): Promise<boolean>;
  consume(onMessage: OnMessageInterface): Promise<void>;
}
