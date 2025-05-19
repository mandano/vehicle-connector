import { typeNames as vehicleModelTypes } from "../../../../../../../connector/common/src/vehicle/model/models/types.ts";
import { paketTypes } from "../../../paketTypes.ts";
import Unknown from "../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";

export interface ToModelInterface {
  run(
    modelName: vehicleModelTypes,
    protocolVersion: string,
    paket: paketTypes,
  ): Unknown | undefined;
}

export default ToModelInterface;
