import VehicleRepositoryHashableInterface from "common/src/repositories/vehicle/VehicleRepositoryHashableInterface.ts";

import { TcpInterfaceMessage } from "../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { ImeiSocketIdRepositoryInterface } from "../../../../common/src/repositories/ImeiSocketIdRepositoryInterface.ts";
import { LoggerInterface } from "../../../../common/src/logger/LoggerInterface.ts";
import ContainsIot from "../../../../common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../common/src/vehicle/components/iot/network/ContainsNetwork.ts";

import { OnDisconnectionInterface } from "./OnDisconnectionInterface.ts";

export class OnDisconnection implements OnDisconnectionInterface {
  constructor(
    private readonly _imeiSocketIdRepository: ImeiSocketIdRepositoryInterface,
    private readonly _vehicleRepository: VehicleRepositoryHashableInterface,
    private readonly _logger: LoggerInterface,
  ) {}

  public async run(
    tcpInterfaceMessage: TcpInterfaceMessage,
  ): Promise<boolean | undefined> {
    const socketId = tcpInterfaceMessage.socketId;
    const imei = this._imeiSocketIdRepository.getImei(socketId);

    if (imei === undefined) {
      this._logger.error("Imei not found", OnDisconnection.name);

      return undefined;
    }

    const hashable = await this._vehicleRepository.findByImei(imei);
    if (hashable === undefined) {
      this._logger.error("Vehicle not found", OnDisconnection.name);

      return undefined;
    }
    const vehicle = hashable.value;

    if (
      ContainsIot.run(vehicle.model) === true &&
      vehicle.model.ioT !== undefined &&
      ContainsNetwork.run(vehicle.model.ioT) === true &&
      vehicle.model.ioT.network !== undefined
    ) {
      vehicle.model.ioT.network.setConnectionModuleToDisconnected(imei);
    }

    await this._vehicleRepository.updateByImei(imei, vehicle.model, hashable.hash);
    this._imeiSocketIdRepository.delete(imei);
  }
}
