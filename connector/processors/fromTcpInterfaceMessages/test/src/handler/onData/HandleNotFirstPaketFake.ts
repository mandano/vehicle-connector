import { HandleNotFirstPaketInterface } from "../../../../src/handler/onData/HandleNotFirstPaketInterface.ts";
import { Imei } from "../../../../../../common/src/vehicle/components/iot/network/protocol/Imei.ts";

export class HandleNotFirstPaketFake implements HandleNotFirstPaketInterface {
  run(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messageLine: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    imei: Imei,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socketId: string,
  ): Promise<void> {
    return Promise.resolve(undefined);
  }
}
