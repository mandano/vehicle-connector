import Unknown from "../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { typeNames as vehicleModelTypes } from "../../../../../../../../connector/common/src/vehicle/model/models/types.ts";
import { paketTypes } from "../../../../paketTypes.ts";
import SimpleUpdate from "../simpleUpdate/SimpleUpdate.ts";
import Lock from "../lock/Lock.ts";
import SimpleUpdateToModel from "../simpleUpdate/models/ToModel.ts";
import LockToModel from "../lock/models/ToModel.ts";

export class ToModel {
  constructor(
    private _simpleUpdate: SimpleUpdateToModel,
    private _lock: LockToModel,
  ) {}

  public run(
    modelName: vehicleModelTypes,
    paket: paketTypes,
  ): Unknown | undefined {
    if (paket instanceof SimpleUpdate) {
      return this._simpleUpdate.run(modelName, paket);
    }

    if (paket instanceof Lock) {
      return this._lock.run(modelName, paket);
    }

    return undefined;
  }
}

export default ToModel;
