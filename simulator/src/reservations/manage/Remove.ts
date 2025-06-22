import { randomUUID } from "node:crypto";

import ContainsIot from "common/src/vehicle/components/iot/ContainsIot.ts";
import LoggerInterface from "common/src/logger/LoggerInterface.ts";

import SimulatedVehicle from "../../vehicles/SimulatedVehicle.ts";
import ChangeModelType from "../../vehicles/ChangeModelType.ts";

export default class Remove {
  constructor(
    private _logger: LoggerInterface,
    private _changeModelType: ChangeModelType,
  ) {}

  public run(vehicles: SimulatedVehicle[], sleepDurationInMilliseconds: number): number {
    const vehiclesToBeRemoved = vehicles.filter(
      (vehicle) => vehicle.reservation!.endTime <= new Date(),
    );

    vehiclesToBeRemoved.forEach(async (vehicle) => {
      let trackingId = `vId:${vehicle.vehicle.id}-${randomUUID()}`;
      let lockResponse = await vehicle.vehicleUserApiActions.lock(trackingId);

      if (!lockResponse) {
        this._logger.warn(`Could not lock vehicle ${vehicle.vehicle.id}`);

        vehicle.reservation!.endTime = new Date(
          Date.now() + sleepDurationInMilliseconds,
        );

        return;
      }

      if (lockResponse.isNotSupportingLocking()) {
        await this._changeModelType.run(vehicle);

        trackingId = `vId:${vehicle.vehicle.id}-${randomUUID()}`;
        lockResponse = await vehicle.vehicleUserApiActions.lock(trackingId);

        if (!lockResponse || !lockResponse.isSuccess()) {
          this._logger.warn(
            `Could not lock vehicle ${vehicle.vehicle.id}, ${lockResponse?.message}`,
          );

          vehicle.reservation!.endTime = new Date(
            Date.now() + sleepDurationInMilliseconds,
          );

          return;
        }
      }

      if (!lockResponse.isSuccess()) {
        this._logger.warn(
          `Could not lock vehicle ${vehicle.vehicle.id}, ${lockResponse?.message}`,
        );

        vehicle.reservation!.endTime = new Date(
          Date.now() + sleepDurationInMilliseconds,
        );

        return;
      }

      if (
        !ContainsIot.run(vehicle.vehicle.model) ||
        vehicle.vehicle.model.ioT === undefined
      ) {
        this._logger.error(
          `Vehicle does not contain IoT ${vehicle.vehicle.id}`,
        );

        return;
      }

      const imei =
        vehicle.vehicle.model.ioT.network?.getImeiOfFirstConnectionModule();

      if (imei === undefined) {
        this._logger.warn(
          `Could not find imei for vehicle ${vehicle.vehicle.id}`,
        );

        return;
      }

      if (!lockResponse) {
        this._logger.warn(`Could not lock vehicle ${imei}`);

        vehicle.reservation!.endTime = new Date(
          Date.now() + sleepDurationInMilliseconds,
        );

        return;
      }

      vehicle.reservation = undefined;
    });

    return vehiclesToBeRemoved.length;
  }
}
