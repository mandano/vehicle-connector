import { SimulatedVehicle } from "../../SimulatedVehicle.ts";
import { Vehicle } from "../../../../../connector/common/src/vehicle/Vehicle.ts";
import { Reservation } from "../../../reservations/Reservation.ts";
import ContainsOdometer from "../../../../../connector/common/src/vehicle/components/odometer/ContainsOdometer.ts";

import { OdometerCalculator } from "./OdometerCalculator.ts";

export class UpdateOdometer {
  run(vehicle: SimulatedVehicle): boolean {
    if (
      !ContainsOdometer.run(vehicle.vehicle.model) ||
      vehicle.vehicle.model.odometer === undefined
    ) {
      return false;
    }

    if (vehicle.vehicle.model.odometer.state === undefined) {
      //TODO: add error log

      return false;
    }

    const originatedAt = vehicle.vehicle.model.odometer.state.originatedAt;

    if (originatedAt === undefined) {
      return false;
    }

    if (vehicle.reservation === undefined) {
      vehicle.vehicle.model.odometer.state.originatedAt = new Date();

      return true;
    }

    const now = new Date();

    if (originatedAt >= now) {
      return false;
    }

    if (vehicle.reservation === undefined) {
      vehicle.vehicle.model.odometer.state.state = 0;

      return true;
    }

    if (
      vehicle.reservation.startTime <= originatedAt &&
      vehicle.reservation.startTime <= now &&
      now <= vehicle.reservation.endTime &&
      originatedAt <= vehicle.reservation.endTime
    ) {
      const addedDistance =
        OdometerCalculator.calcDrivenDistanceForIntervalDuringReservation(
          originatedAt,
          now,
          vehicle.reservation,
        );

      this.updateOdometer(vehicle.vehicle, addedDistance);

      return true;
    }

    if (
      originatedAt < vehicle.reservation.startTime &&
      vehicle.reservation.startTime < now
    ) {
      this.updateWhenIntervalOverlapStartReservation(
        vehicle.vehicle,
        vehicle.reservation,
        now,
      );

      return true;
    }

    if (
      originatedAt < vehicle.reservation.endTime &&
      vehicle.reservation.endTime < now
    ) {
      this.updateWhenIntervalOverlapEndReservation(
        vehicle.vehicle,
        vehicle.reservation,
        originatedAt,
      );

      return true;
    }

    return true;
  }

  private updateWhenIntervalOverlapStartReservation(
    vehicle: Vehicle,
    reservation: Reservation,
    now: Date,
  ) {
    const addedMileage =
      OdometerCalculator.calcDrivenDistanceForIntervalDuringReservation(
        reservation.startTime,
        now,
        reservation,
      );

    this.updateOdometer(vehicle, addedMileage);
  }

  private updateWhenIntervalOverlapEndReservation(
    vehicle: Vehicle,
    reservation: Reservation,
    mostRecentOriginatedAt: Date,
  ) {
    const addedMileage =
      OdometerCalculator.calcDrivenDistanceForIntervalDuringReservation(
        mostRecentOriginatedAt,
        reservation.endTime,
        reservation,
      );

    this.updateOdometer(vehicle, addedMileage);
  }

  private updateOdometer(vehicle: Vehicle, addedMileage: number) {
    if (
      !ContainsOdometer.run(vehicle.model) ||
      vehicle.model.odometer === undefined
    ) {
      return;
    }

    vehicle.model.odometer.state.state += addedMileage;
    vehicle.model.odometer.state.originatedAt = new Date();
  }
}
