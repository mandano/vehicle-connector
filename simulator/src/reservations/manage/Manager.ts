import { randomUUID } from "node:crypto";

import { SimulatedVehicle } from "../../vehicles/SimulatedVehicle.ts";
import { CreateReservation } from "../CreateReservation.ts";
import { Model } from "../../../../connector/common/src/vehicle/model/models/Model.ts";
import { Coordinate } from "../../vehicles/position/Coordinate.ts";
import { BIKE } from "../../adapters/graphhopper/VehicleTypes.ts";
import { GetRandomRadiusCoordinateTowardsTarget } from "../../vehicles/position/GetRandomRadiusCoordinateTowardsTarget.ts";
import { LoggerInterface } from "../../../../connector/common/src/logger/LoggerInterface.ts";
import ContainsIot from "../../../../connector/common/src/vehicle/components/iot/ContainsIot.ts";

import { ScenarioInterface } from "./ScenarioInterface.ts";

export class Manager {
  private _vehicles: SimulatedVehicle[];
  private _scenario: ScenarioInterface;
  private _createReservation: CreateReservation;
  private _getRandomRadiusCoordinateTowardsTarget: GetRandomRadiusCoordinateTowardsTarget;
  private _sleepDurationInMilliseconds: number = 1000;
  private _logger: LoggerInterface;
  private _active: boolean = true;
  private _reservationCount: number = 0;

  constructor(
    vehicles: SimulatedVehicle[],
    scenario: ScenarioInterface,
    createReservation: CreateReservation,
    getRandomRadiusCoordinateTowardsTarget: GetRandomRadiusCoordinateTowardsTarget,
    logger: LoggerInterface,
  ) {
    this._vehicles = vehicles;
    this._scenario = scenario;
    this._createReservation = createReservation;
    this._getRandomRadiusCoordinateTowardsTarget =
      getRandomRadiusCoordinateTowardsTarget;
    this._logger = logger;
  }

  public async run() {
    while (this._active) {
      await this.manageReservations();
      await this.sleep();
    }
  }

  private sleep() {
    return new Promise((resolve) => {
      setTimeout(resolve, this._sleepDurationInMilliseconds);
    });
  }

  private async manageReservations() {
    this.removeRunoutReservations();
    await this.addReservationsIfTooLittle();
  }

  private findVehiclesWithoutReservation() {
    return this._vehicles.filter((vehicle) => !vehicle.reservation);
  }

  private findVehiclesWithReservation() {
    return this._vehicles.filter((vehicle) => vehicle.reservation);
  }

  private missingReservationsCount() {
    const vehiclesWithReservation = this.findVehiclesWithReservation();

    const currentRelation =
      vehiclesWithReservation.length / this._vehicles.length;
    const targetRelation = this._scenario.vehiclesReservedAtSameTimePercentage;

    if (currentRelation >= targetRelation) {
      return 0;
    }

    const missingReservationsCount = Math.floor(
      this._vehicles.length * (targetRelation - currentRelation) -
        vehiclesWithReservation.length,
    );

    if (missingReservationsCount <= 0) {
      return 1;
    }
    return missingReservationsCount;
  }

  private vehicleContainsCoordinates(vehicle: SimulatedVehicle): boolean {
    const a = ContainsIot.run(vehicle.vehicle.model);

    return (
      a &&
      vehicle.vehicle.model.ioT !== undefined &&
      vehicle.vehicle.model.ioT.position !== undefined &&
      vehicle.vehicle.model.ioT.position.latitude !== undefined &&
      vehicle.vehicle.model.ioT.position.longitude !== undefined
    );
  }

  private async addReservationsIfTooLittle() {
    const missingReservationsCount = this.missingReservationsCount();

    if (missingReservationsCount <= 0) {
      this._logger.debug("No missing reservations");

      return;
    }

    const vehiclesWithoutReservation = this.findVehiclesWithoutReservation();

    const vehiclesWithoutReservationAndWithPosition =
      vehiclesWithoutReservation.filter((vehicle) =>
        this.vehicleContainsCoordinates(vehicle),
      );

    const randomVehiclesWithoutReservation =
      vehiclesWithoutReservationAndWithPosition
        .sort(() => 0.5 - Math.random())
        .slice(0, missingReservationsCount);

    for (const vehicle of randomVehiclesWithoutReservation) {
      await this.addReservation(vehicle);
    }
  }

  private async addReservation(vehicle: SimulatedVehicle): Promise<boolean> {
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
      await this.changeModelType(vehicle);

      trackingId = `vId:${vehicle.vehicle.id}-${randomUUID()}`;
      unlockResponse = await vehicle.vehicleUserApiActions.unlock(trackingId);

      if (!unlockResponse || !unlockResponse.isSuccess()) {
        this._logger.warn(
          `Could not lock vehicle ${imei}, ${unlockResponse?.message}`,
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
      this._reservationCount,
      startCoordinate,
      endCoordinate,
      BIKE,
    );

    return true;
  }

  private removeRunoutReservations(): number {
    const vehiclesWithReservation = this.findVehiclesWithReservation();

    const vehiclesToBeRemoved = vehiclesWithReservation.filter(
      (vehicle) => vehicle.reservation!.endTime <= new Date(),
    );

    vehiclesToBeRemoved.forEach(async (vehicle) => {
      let trackingId = `vId:${vehicle.vehicle.id}-${randomUUID()}`;
      let lockResponse = await vehicle.vehicleUserApiActions.lock(trackingId);

      if (!lockResponse) {
        this._logger.warn(`Could not lock vehicle ${vehicle.vehicle.id}`);

        vehicle.reservation!.endTime = new Date(
          Date.now() + this._sleepDurationInMilliseconds,
        );

        return;
      }

      if (lockResponse.isNotSupportingLocking()) {
        await this.changeModelType(vehicle);

        trackingId = `vId:${vehicle.vehicle.id}-${randomUUID()}`;
        lockResponse = await vehicle.vehicleUserApiActions.lock(trackingId);

        if (!lockResponse || !lockResponse.isSuccess()) {
          this._logger.warn(
            `Could not lock vehicle ${vehicle.vehicle.id}, ${lockResponse?.message}`,
          );

          vehicle.reservation!.endTime = new Date(
            Date.now() + this._sleepDurationInMilliseconds,
          );

          return;
        }
      }

      if (!lockResponse.isSuccess()) {
        this._logger.warn(
          `Could not lock vehicle ${vehicle.vehicle.id}, ${lockResponse?.message}`,
        );

        vehicle.reservation!.endTime = new Date(
          Date.now() + this._sleepDurationInMilliseconds,
        );

        return;
      }

      if (
        !ContainsIot.run(vehicle.vehicle.model) ||
        vehicle.vehicle.model.ioT === undefined
      ) {
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
          Date.now() + this._sleepDurationInMilliseconds,
        );

        return;
      }

      vehicle.reservation = undefined;
    });

    return vehiclesToBeRemoved.length;
  }

  private async changeModelType(vehicle: SimulatedVehicle): Promise<void> {
    if (
      !ContainsIot.run(vehicle.vehicle.model) ||
      vehicle.vehicle.model.ioT === undefined
    ) {
      return;
    }

    await vehicle.vehicleUserApiActions.updateModelName("LockableScooter");
  }
}
