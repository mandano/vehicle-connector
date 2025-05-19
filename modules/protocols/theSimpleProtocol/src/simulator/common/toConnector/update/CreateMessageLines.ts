import { ID_0_1, ID_0_2 } from "../../../../versions.ts";
import { Vehicle } from "../../../../../../../../connector/common/src/vehicle/Vehicle.ts";
import { ToMessageLines as CreateMessageLines0_1 } from "../../../0_1/common/toConnector/update/ToMessageLines.ts";
import { CreateMessageLines as CreateMessageLines0_2 } from "../../../0_2/common/toConnector/update/CreateMessageLines.ts";

import { CreateMessageLinesByProtocolVersionInterface } from "./CreateMessageLinesInterface.ts";

export class CreateMessageLines implements CreateMessageLinesByProtocolVersionInterface {
  constructor(
    private _create0_1: CreateMessageLines0_1,
    private _create0_2: CreateMessageLines0_2,
  ) {}

  public run(protocolVersion: string, vehicle: Vehicle): string[] | undefined {
    if (protocolVersion === ID_0_1) {
      return this._create0_1.run(vehicle);
    }

    if (protocolVersion === ID_0_2) {
      return this._create0_2.run(vehicle);
    }

    return undefined;
  }
}
