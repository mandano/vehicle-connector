import SimulatedVehicle from "../../vehicles/SimulatedVehicle.ts";
import LoggerInterface from "../../../../connector/common/src/logger/LoggerInterface.ts";
import ContainsIot from "../../../../connector/common/src/vehicle/components/iot/ContainsIot.ts";

import ScenarioInterface from "./ScenarioInterface.ts";
import Add from "./Add.ts";
import Remove from "./Remove.ts";

export default class Manage {
  private _sleepDurationInMilliseconds: number = 1000;
  private _active: boolean = true;
  private _latestReservationId: number = 0;

  constructor(
    private _vehicles: SimulatedVehicle[],
    private _scenario: ScenarioInterface,
    private _logger: LoggerInterface,
    private _add: Add,
    private _remove: Remove,
  ) {}

  public async run() {
    while (this._active) {
      await this.balanceReservations();
      await this.sleep();
    }
  }

  private sleep() {
    return new Promise((resolve) => {
      setTimeout(resolve, this._sleepDurationInMilliseconds);
    });
  }

  private async balanceReservations() {
    this._remove.run(
      this.findVehiclesWithReservation(),
      this._sleepDurationInMilliseconds,
    );
    await this.addReservationsIfTooLittle();
  }

  private findVehiclesWithoutReservation(): SimulatedVehicle[] {
    return this._vehicles.filter((vehicle) => !vehicle.reservation);
  }

  private findVehiclesWithReservation(): SimulatedVehicle[] {
    return this._vehicles.filter((vehicle) => vehicle.reservation);
  }

  private missingReservationsCount(): number {
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
      vehicle.vehicle.model.ioT.position.latitude.state !== undefined &&
      vehicle.vehicle.model.ioT.position.longitude.state !== undefined
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
      const added = await this._add.run(vehicle, this._latestReservationId + 1);

      if (!added) {
        continue;
      }
      this._latestReservationId++;
      this._logger.debug(
        `Added reservation for vehicle ${vehicle.vehicle.id}, current reservation id: ${this._latestReservationId}`,
      );
    }
  }
}
