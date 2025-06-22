import { randomUUID } from "node:crypto";

import ContainsIot from "common/src/vehicle/components/iot/ContainsIot.ts";
import { Model } from "common/src/vehicle/model/models/Model.ts";
import LoggerInterface from "common/src/logger/LoggerInterface.ts";

import { SimulatedVehicle } from "../../vehicles/SimulatedVehicle.ts";
import { Coordinate } from "../../vehicles/position/Coordinate.ts";
import { BIKE } from "../../adapters/graphhopper/VehicleTypes.ts";
import { CreateReservation } from "../CreateReservation.ts";
import {
  GetRandomRadiusCoordinateTowardsTarget
} from "../../vehicles/position/GetRandomRadiusCoordinateTowardsTarget.ts";
import ChangeModelType from "../../vehicles/ChangeModelType.ts";

export default class Add {
  constructor(
    private _logger: LoggerInterface,
    private _createReservation: CreateReservation,
    private _getRandomRadiusCoordinateTowardsTarget: GetRandomRadiusCoordinateTowardsTarget,
    private _changeModelType: ChangeModelType,
  ) {}

  public async run(vehicle: SimulatedVehicle, reservationId: number): Promise<boolean> {
    if (
      !(
        ContainsIot.run(vehicle.vehicle.model) &&
        vehicle.vehicle.model.ioT !== undefined &&
        vehicle.vehicle.model.ioT.position !== undefined &&
        vehicle.vehicle.model.ioT.position.latitude !== undefined &&
        vehicle.vehicle.model.ioT.position.longitude !== undefined
      )
    ) {
      this._logger.warn("Missing vehicle attribute/s");

      return false;
    }

    if (
      !Model.containsBatteries(vehicle.vehicle.model) ||
      vehicle.vehicle.model.batteries === undefined ||
      vehicle.vehicle.model.batteries.getAvgLevel() <= 15
    ) {
      this._logger.warn("Low fuel level");

      return false;
    }

    const startCoordinate = new Coordinate(
      vehicle.vehicle.model.ioT.position.latitude.state,
      vehicle.vehicle.model.ioT.position.longitude.state,
    );

    const endCoordinate = this._getRandomRadiusCoordinateTowardsTarget.run(
      startCoordinate,
      vehicle.location.coordinate,
    );

    const imei =
      vehicle.vehicle.model.ioT.network?.getImeiOfFirstConnectionModule();

    if (imei === undefined) {
      this._logger.warn(
        `Could not find imei for vehicle ${vehicle.vehicle.id}`,
      );

      return false;
    }

    let trackingId = `vId:${vehicle.vehicle.id}-${randomUUID()}`;
    let unlockResponse = await vehicle.vehicleUserApiActions.unlock(trackingId);

    if (!unlockResponse) {
      this._logger.warn(`Could not unlock vehicle`);

      return false;
    }

    if (unlockResponse.isNotSupportingUnlocking()) {
      await this._changeModelType.run(vehicle);

      trackingId = `vId:${vehicle.vehicle.id}-${randomUUID()}`;
      unlockResponse = await vehicle.vehicleUserApiActions.unlock(trackingId);

      if (!unlockResponse || !unlockResponse.isSuccess()) {
        this._logger.warn(
          `Could not unlock vehicle ${imei}, ${unlockResponse?.message}`,
        );

        return false;
      }
    }

    if (!unlockResponse.isSuccess()) {
      this._logger.warn(
        `Could not unlock vehicle ${imei}, ${unlockResponse?.message}`,
      );

      return false;
    }

    vehicle.reservation = await this._createReservation.run(
      reservationId,
      startCoordinate,
      endCoordinate,
      BIKE,
    );

    return true;
  }
}
