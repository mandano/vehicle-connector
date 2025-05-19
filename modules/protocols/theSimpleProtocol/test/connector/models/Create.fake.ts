import ToModelInterface from "../../../src/connector/common/models/ToModelInterface.ts";
import { Unknown } from "../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { paketTypes } from "../../../src/paketTypes.ts";
import { typeNames } from "../../../../../../connector/common/src/vehicle/model/models/types.ts";

export class Create implements ToModelInterface {
  run(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    modelName: typeNames,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protocolVersion: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    paket: paketTypes,
  ): Unknown | undefined {
    return undefined;
  }
}
