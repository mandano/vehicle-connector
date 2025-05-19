import { SaveVehicleInterface } from "../../../../src/handler/onData/SaveVehicleInterface.ts";
import { Imei } from "../../../../../../common/src/vehicle/components/iot/network/protocol/Imei.ts";
import { Unknown } from "../../../../../../common/src/vehicle/model/models/Unknown.ts";

export class SaveMessageLineContextToVehicle
  implements SaveVehicleInterface
{
  constructor(private readonly _vehicleId?: number) {
    this._vehicleId = _vehicleId ?? undefined;
  }

  run(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    model: Unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    imei: Imei
  ): number | undefined {
    return this._vehicleId;
  }
}
