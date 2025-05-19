import { TcpInterfaceMessage } from "../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import VehicleRepositoryInterface from "../../../../common/src/repositories/VehicleRepositoryInterface.ts";
import { ImeiSocketIdRepositoryInterface } from "../../../../common/src/repositories/ImeiSocketIdRepositoryInterface.ts";
import { LoggerInterface } from "../../../../common/src/logger/LoggerInterface.ts";
import ContainsIot from "../../../../common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../common/src/vehicle/components/iot/network/ContainsNetwork.ts";

import { OnDisconnectionInterface } from "./OnDisconnectionInterface.ts";

export class OnDisconnection implements OnDisconnectionInterface {
  private _imeiSocketIdRepository: ImeiSocketIdRepositoryInterface;
  private _vehicleRepository: VehicleRepositoryInterface;
  private _logger: LoggerInterface;

  constructor(
    imeiSocketIdRepository: ImeiSocketIdRepositoryInterface,
    vehicleRepository: VehicleRepositoryInterface,
    logger: LoggerInterface,
  ) {
    this._imeiSocketIdRepository = imeiSocketIdRepository;
    this._vehicleRepository = vehicleRepository;
    this._logger = logger;
  }

  public run(tcpInterfaceMessage: TcpInterfaceMessage): boolean | undefined {
    const socketId = tcpInterfaceMessage.socketId;
    const imei = this._imeiSocketIdRepository.getImei(socketId);

    if (imei === undefined) {
      this._logger.error("Imei not found", OnDisconnection.name);

      return undefined;
    }

    const vehicle = this._vehicleRepository.findByImei(imei);
    if (vehicle === undefined) {
      this._logger.error("Vehicle not found", OnDisconnection.name);

      return undefined;
    }

    if (
      ContainsIot.run(vehicle.model) === true &&
      vehicle.model.ioT !== undefined &&
      ContainsNetwork.run(vehicle.model.ioT) === true &&
      vehicle.model.ioT.network !== undefined
    ) {
      vehicle.model.ioT.network.setConnectionModuleToDisconnected(imei);
    }

    this._vehicleRepository.updateByImei(imei, vehicle.model);
    this._imeiSocketIdRepository.delete(imei);
  }
}
