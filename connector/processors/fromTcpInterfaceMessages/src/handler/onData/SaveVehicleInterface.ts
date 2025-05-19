import { Imei } from "../../../../../common/src/vehicle/components/iot/network/protocol/Imei.ts";
import { Unknown } from "../../../../../common/src/vehicle/model/models/Unknown.ts";

export interface SaveVehicleInterface {
  run(model: Unknown, imei: Imei): number | undefined;
}
