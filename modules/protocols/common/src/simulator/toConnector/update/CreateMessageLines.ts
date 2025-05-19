import { Vehicle } from "../../../../../../../connector/common/src/vehicle/Vehicle.ts";
import { THE_SIMPLE_PROTOCOL } from "../../../../../theSimpleProtocol/src/Protocol.ts";
import { CreateMessageLinesByProtocolVersionInterface } from "../../../../../theSimpleProtocol/src/simulator/common/toConnector/update/CreateMessageLinesInterface.ts";
import ContainsIot from "../../../../../../../connector/common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../../../../connector/common/src/vehicle/components/iot/network/ContainsNetwork.ts";

import CreateMessageLinesInterface from "./CreateMessageLinesInterface.ts";

export class CreateMessageLines implements CreateMessageLinesInterface {
  constructor(
    private _createMessageLinesTheSimpleProtocol: CreateMessageLinesByProtocolVersionInterface,
  ) {}
  public run(vehicle: Vehicle): string[] | undefined {
    if (
      ContainsIot.run(vehicle.model) === false ||
      vehicle.model.ioT === undefined
    ) {
      return undefined;
    }

    if (
      ContainsNetwork.run(vehicle.model.ioT) === false ||
      vehicle.model.ioT.network === undefined
    ) {
      return undefined;
    }

    const connectionModule = vehicle.model.ioT.network.connectionModules[0];

    if (
      connectionModule.setProtocol === undefined ||
      connectionModule.setProtocolVersion === undefined
    ) {
      return undefined;
    }

    if (connectionModule.setProtocol.state === THE_SIMPLE_PROTOCOL) {
      return this._createMessageLinesTheSimpleProtocol.run(
        connectionModule.setProtocolVersion.state,
        vehicle,
      );
    }

    return undefined;
  }
}
