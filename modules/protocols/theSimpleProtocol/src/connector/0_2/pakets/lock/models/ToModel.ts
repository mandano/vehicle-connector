import { Unknown } from "../../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { typeNames as vehicleModelTypes } from "../../../../../../../../../connector/common/src/vehicle/model/models/types.ts";
import { Lock } from "../../../../0_1/pakets/lock/Lock.ts";
import { CreateUnknown } from "../../../../0_1/pakets/lock/models/unknown/CreateUnknown.ts";

class ToModel {
  constructor(private _unknown: CreateUnknown) {}

  public run(modelName: vehicleModelTypes, paket: Lock): Unknown | undefined {
    if (modelName === Unknown.name) {
      return this._unknown.run(paket);
    }

    return undefined;
  }
}

export default ToModel;
