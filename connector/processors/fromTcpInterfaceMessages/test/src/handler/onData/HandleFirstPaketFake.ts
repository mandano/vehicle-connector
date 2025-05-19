import { HandleFirstPaketInterface } from "../../../../src/handler/onData/HandleFirstPaketInterface.ts";

export class HandleFirstPaketFake implements HandleFirstPaketInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(messageLine: string, socketId: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
