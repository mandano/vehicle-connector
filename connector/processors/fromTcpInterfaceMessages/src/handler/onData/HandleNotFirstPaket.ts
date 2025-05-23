import { MessageLineContext } from "../../../../../common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";
import { Imei } from "../../../../../common/src/vehicle/components/iot/network/protocol/Imei.ts";
import { AcknowledgeInterface } from "../../../../../common/src/vehicle/components/iot/network/protocol/AcknowledgeInterface.ts";
import { LoggerInterface } from "../../../../../common/src/logger/LoggerInterface.ts";
import VehicleRepositoryInterface from "../../../../../common/src/repositories/VehicleRepositoryInterface.ts";
import { CreateByMessageLineContextInterface } from "../../../../../../modules/protocols/common/src/connector/fromVehicle/models/CreateByMessageLineContextInterface.ts";
import { CreateByProtocolAndVersionInterface } from "../../../../../../modules/protocols/common/src/connector/fromVehicle/CreateByProtocolAndVersionInterface.ts";
import ContainsIot from "../../../../../common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../../common/src/vehicle/components/iot/network/ContainsNetwork.ts";

import { HandleNotFirstPaketInterface } from "./HandleNotFirstPaketInterface.ts";
import { ForwardToActionResponsesInterface } from "./ForwardToActionResponsesInterface.ts";
import { UpdateVehicle } from "./UpdateVehicle.ts";

export class HandleNotFirstPaket implements HandleNotFirstPaketInterface {
  constructor(
    private readonly _vehicleRepository: VehicleRepositoryInterface,
    private _updateVehicle: UpdateVehicle,
    private _createMessageLineContext: CreateByProtocolAndVersionInterface,
    private _createModelByPaket: CreateByMessageLineContextInterface,
    private _forwardLockAttribute: ForwardToActionResponsesInterface,
    private _acknowledge: AcknowledgeInterface,
    private readonly _logger: LoggerInterface,
  ) {}
  public async run(
    messageLine: string,
    imei: Imei,
    socketId: string,
  ): Promise<void> {
    const vehicleStored = this._vehicleRepository.findByImei(imei);
    if (vehicleStored === undefined) {
      this._logger.error(
        `Vehicle with IMEI ${imei} not found`,
        HandleNotFirstPaket.name,
      );
      return;
    }

    if (
      !ContainsIot.run(vehicleStored.model) ||
      vehicleStored.model.ioT === undefined ||
      !ContainsNetwork.run(vehicleStored.model.ioT) ||
      vehicleStored.model.ioT.network === undefined
    ) {
      this._logger.error(
        `Vehicle with IMEI ${imei} does not contain IoT`,
        HandleNotFirstPaket.name,
      );
      return;
    }

    const connectionModule =
      vehicleStored.model.ioT.network.getConnectedModuleByImei(imei);

    if (!connectionModule) {
      this._logger.error(
        `Connection module with IMEI ${imei} not found`,
        HandleNotFirstPaket.name,
      );
      return;
    }

    const protocol = connectionModule.setProtocol?.state;
    const protocolVersion = connectionModule.setProtocolVersion?.state;

    if (protocol === undefined || protocolVersion === undefined) {
      this._logger.error(
        `Protocol or protocol version not set`,
        HandleNotFirstPaket.name,
      );
      return;
    }

    const messageLineContext = this._createMessageLineContext.run(
      messageLine,
      protocol,
      protocolVersion,
    );

    if (messageLineContext === undefined) {
      return;
    }

    const vehicleModelByPaket =
      this._createModelByPaket.run(messageLineContext);

    if (vehicleModelByPaket === undefined) {
      this._logger.error(
        `Vehicle model by paket not created`,
        HandleNotFirstPaket.name,
      );
      return;
    }

    const updated = this._updateVehicle.run(
      vehicleModelByPaket,
      vehicleStored.model,
    );

    if (updated === false) {
      this._logger.error(`Vehicle model not updated`, HandleNotFirstPaket.name);
      return;
    }

    if (vehicleModelByPaket?.lock?.state !== undefined) {
      const forwarded = await this._forwardLockAttribute.run(
        vehicleModelByPaket.lock.state.state,
        vehicleStored.id,
      );

      if (forwarded !== true) {
        this._logger.error(
          `Forward lock attribute failed`,
          HandleNotFirstPaket.name,
        );
        return;
      } else {
        this._logger.info(
          `Forward lock attribute succeeded`,
          HandleNotFirstPaket.name,
        );
      }
    }

    await this.acknowledge(socketId, messageLineContext);
  }

  private async acknowledge(
    socketId: string,
    messageLineContext: MessageLineContext,
  ): Promise<boolean> {
    const acknowledged = await this._acknowledge.run(
      socketId,
      messageLineContext,
    );

    if (acknowledged !== true) {
      this._logger.info(`Acknowledge not sent`, HandleNotFirstPaket.name);
      return false;
    }

    return true;
  }
}
