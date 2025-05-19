import { Imei } from "../../../../../common/src/vehicle/components/iot/network/protocol/Imei.ts";

export interface HandleNotFirstPaketInterface {
  run(
    messageLine: string,
    imei: Imei,
    socketId: string,
  ): Promise<void>;
}
