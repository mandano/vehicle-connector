import Unknown from "../../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { typeNames as vehicleModelTypes } from "../../../../../../../../../connector/common/src/vehicle/model/models/types.ts";
import SimpleUpdate from "../SimpleUpdate.ts";

import CreateUnknown from "./unknown/CreateUnknown.ts";

export class ToModel {
  constructor(private _unknown: CreateUnknown) {}

  public run(
    modelName: vehicleModelTypes,
    paket: SimpleUpdate,
  ): Unknown | undefined {
    if (modelName === Unknown.name) {
      return this._unknown.run(paket);
    }

    return undefined;
  }
}

export default ToModel;
