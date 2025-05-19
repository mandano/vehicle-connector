import Unknown from "../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { typeNames as vehicleModelTypes } from "../../../../../../../connector/common/src/vehicle/model/models/types.ts";
import { paketTypes } from "../../../paketTypes.ts";
import { ID_0_1, ID_0_2 } from "../../../versions.ts";
import { ToModel as Create_0_1 } from "../../0_1/pakets/common/ToModel.ts";
import Create_0_2 from "../../0_2/pakets/common/ToModel.ts";

import ToModelInterface from "./ToModelInterface.ts";

export class ToModel implements ToModelInterface {
  constructor(
    private readonly _create_0_1: Create_0_1,
    private readonly _create_0_2: Create_0_2,
  ) {}

  public run(
    modelName: vehicleModelTypes,
    protocolVersion: string,
    paket: paketTypes,
  ): Unknown | undefined {
    if (protocolVersion === ID_0_1) {
      return this._create_0_1.run(modelName, paket);
    }

    if (protocolVersion === ID_0_2) {
      return this._create_0_2.run(modelName, paket);
    }

    return undefined;
  }
}
