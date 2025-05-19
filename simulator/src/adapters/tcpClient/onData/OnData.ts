import { Vehicle } from "../../../../../connector/common/src/vehicle/Vehicle.ts";
import { HashColoredLoggerInterface } from "../../../../../connector/common/src/logger/HashColoredLoggerInterface.ts";
import { ReactToAction } from "../../../vehicles/actions/ReactToAction.ts";
import CreateByProtocolAndVersionInterface from "../../../../../modules/protocols/common/src/simulator/fromConnector/messageLineContext/CreateByProtocolAndVersionInterface.ts";
import CreateActionInterface from "../../../../../modules/protocols/common/src/simulator/toConnector/update/action/CreateActionInterface.ts";
import ContainsIot from "../../../../../connector/common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../../connector/common/src/vehicle/components/iot/network/ContainsNetwork.ts";

import { OnDataInterface } from "./OnDataInterface.ts";

export class OnData implements OnDataInterface {
  constructor(
    private _hashColoredLogger: HashColoredLoggerInterface,
    private _createAction: CreateActionInterface,
    private _reactToAction: ReactToAction,
    private _createMessageLineContext: CreateByProtocolAndVersionInterface,
  ) {}

  public async run(messageLine: string, vehicle: Vehicle) {
    if (
      !ContainsIot.run(vehicle.model) ||
      vehicle.model.ioT === undefined ||
      !ContainsNetwork.run(vehicle.model.ioT) ||
      vehicle.model.ioT.network === undefined
    ) {
      return;
    }

    const connectionModule = vehicle.model.ioT.network.connectionModules[0];

    if (!connectionModule) {
      return;
    }

    const protocol = connectionModule.setProtocol?.state;
    const protocolVersion = connectionModule.setProtocolVersion?.state;

    if (protocol === undefined || protocolVersion === undefined) {
      return;
    }

    const messageLineContext = this._createMessageLineContext.run(
      messageLine,
      protocol,
      protocolVersion,
    );

    if (
      messageLineContext?.paket === undefined ||
      messageLineContext?.protocol === undefined
    ) {
      return false;
    }

    const action = this._createAction.run(messageLineContext.paket);

    if (action === undefined) {
      return false;
    }

    const forwardedReaction = await this._reactToAction.run(
      action,
      vehicle,
      messageLineContext,
    );

    if (messageLineContext.trackingId !== undefined) {
      if (forwardedReaction === undefined || forwardedReaction === false) {
        this._hashColoredLogger.error(
          "Did not forward reaction",
          messageLineContext.trackingId,
          OnData.name,
        );
      }
    }
  }
}
