import { MessageLineContext } from "../../../../../common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";
import { ImeiSocketIdRepositoryInterface } from "../../../../../common/src/repositories/ImeiSocketIdRepositoryInterface.ts";
import { CreateByMessageLineContextInterface } from "../../../../../../modules/protocols/common/src/connector/fromVehicle/models/CreateByMessageLineContextInterface.ts";
import { AcknowledgeInterface } from "../../../../../common/src/vehicle/components/iot/network/protocol/AcknowledgeInterface.ts";
import { LoggerInterface } from "../../../../../common/src/logger/LoggerInterface.ts";
import CreateMessageLineContextInterface from "../../../../../../modules/protocols/common/src/connector/fromVehicle/CreateInterface.ts";
import ContainsIot from "../../../../../common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../../common/src/vehicle/components/iot/network/ContainsNetwork.ts";

import { HandleFirstPaketInterface } from "./HandleFirstPaketInterface.ts";
import { SaveVehicleInterface } from "./SaveVehicleInterface.ts";
import { ForwardToActionResponsesInterface } from "./ForwardToActionResponsesInterface.ts";

export class HandleFirstPaket implements HandleFirstPaketInterface {
  constructor(
    private readonly _imeiSocketIdRepository: ImeiSocketIdRepositoryInterface,
    private readonly _saveVehicle: SaveVehicleInterface,
    private readonly _createModelByPaket: CreateByMessageLineContextInterface,
    private readonly _forwardLockAttribute: ForwardToActionResponsesInterface,
    private readonly _acknowledge: AcknowledgeInterface,
    private readonly _logger: LoggerInterface,
    private readonly _createMessageLineContext: CreateMessageLineContextInterface,
  ) {}

  public async run(messageLine: string, socketId: string): Promise<void> {
    const messageLineContext = this._createMessageLineContext.run(messageLine);

    if (messageLineContext === undefined) {
      this._logger.warn(
        `Message line context not created`,
        HandleFirstPaket.name,
      );
      return;
    }

    const imei = messageLineContext.imei;

    if (imei === undefined) {
      return;
    }

    // in case already existed, this should not be the case in the first place
    // add debugging logs here
    this._imeiSocketIdRepository.delete(imei);
    this._imeiSocketIdRepository.create(imei, socketId);

    const vehicleModelByPaket =
      this._createModelByPaket.run(messageLineContext);

    if (vehicleModelByPaket === undefined) {
      return;
    }

    if (
      ContainsIot.run(vehicleModelByPaket) === true &&
      vehicleModelByPaket.ioT !== undefined &&
      ContainsNetwork.run(vehicleModelByPaket.ioT) === true &&
      vehicleModelByPaket.ioT.network !== undefined
    ) {
      vehicleModelByPaket.ioT.network.setConnectionModuleToConnected(imei);
    }

    const vehicleId = await this._saveVehicle.run(vehicleModelByPaket, imei);

    if (
      vehicleModelByPaket?.lock?.state !== undefined &&
      vehicleId !== undefined
    ) {
      const forwarded = await this._forwardLockAttribute.run(
        vehicleModelByPaket.lock.state.state.state,
        vehicleId,
      );

      if (forwarded !== true) {
        this._logger.error(
          `Forward lock attribute failed`,
          HandleFirstPaket.name,
        );
        return;
      } else {
        this._logger.info(
          `Forward lock attribute succeeded`,
          HandleFirstPaket.name,
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
      this._logger.info(`Acknowledge not sent`, HandleFirstPaket.name);
      return false;
    }

    return true;
  }
}
