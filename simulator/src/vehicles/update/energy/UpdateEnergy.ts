import { SimulatedVehicle } from "../../SimulatedVehicle.ts";
import { Model } from "../../../../../connector/common/src/vehicle/model/models/Model.ts";
import { Reservation } from "../../../reservations/Reservation.ts";
import { Vehicle } from "../../../../../connector/common/src/vehicle/Vehicle.ts";

import { EnergyCalculator } from "./EnergyCalculator.ts";

export class UpdateEnergy {
  public run(vehicle: SimulatedVehicle): boolean {
    if (
      !Model.containsBatteries(vehicle.vehicle.model) ||
      vehicle.vehicle.model.batteries === undefined
    ) {
      return false;
    }

    const mostRecentOriginatedAt =
      vehicle.vehicle.model.batteries.latestOriginateAt();
    const avgEnergyLevel = vehicle.vehicle.model.batteries.getAvgLevel();

    if (mostRecentOriginatedAt === undefined) {
      return false;
    }

    const now = new Date();

    if (mostRecentOriginatedAt >= now) {
      return false;
    }

    const millisecondsSinceLastUpdate =
      now.getTime() - mostRecentOriginatedAt.getTime();
    const secondsSinceLastUpdate = millisecondsSinceLastUpdate / 1000;

    if (vehicle.reservation === undefined) {
      const energyLossSinceLastUpdate =
        EnergyCalculator.calcEnergyLossWhileLocked(secondsSinceLastUpdate);

      const energyLevel = avgEnergyLevel - energyLossSinceLastUpdate;

      this.updateBatteries(
        vehicle.vehicle,
        energyLevel < 0 ? 0 : energyLevel,
      );

      return true;
    }

    if (
      vehicle.reservation.startTime <= mostRecentOriginatedAt &&
      vehicle.reservation.startTime <= now &&
      now <= vehicle.reservation.endTime &&
      mostRecentOriginatedAt <= vehicle.reservation.endTime
    ) {
      const energyLossSinceLastUpdate =
        EnergyCalculator.calcEnergyLossWhileInSimulatedReservation(
          mostRecentOriginatedAt,
          now,
          vehicle.reservation,
        );

      const energyLevel = avgEnergyLevel - energyLossSinceLastUpdate;

      this.updateBatteries(
        vehicle.vehicle,
        energyLevel < 0 ? 0 : energyLevel,
      );

      return true;
    }

    if (
      mostRecentOriginatedAt < vehicle.reservation.startTime &&
      vehicle.reservation.startTime < now
    ) {
      this.updateWhenIntervalOverlapStartReservation(
        vehicle.vehicle,
        vehicle.reservation,
        mostRecentOriginatedAt,
        now,
        avgEnergyLevel,
      );

      return true;
    }

    if (
      mostRecentOriginatedAt < vehicle.reservation.endTime &&
      vehicle.reservation.endTime < now
    ) {
      this.updateWhenIntervalOverlapEndReservation(
        vehicle.vehicle,
        vehicle.reservation,
        mostRecentOriginatedAt,
        now,
        avgEnergyLevel,
      );

      return true;
    }

    return true;
  }

  private updateWhenIntervalOverlapStartReservation(
    vehicle: Vehicle,
    reservation: Reservation,
    mostRecentOriginatedAt: Date,
    now: Date,
    avgEnergyLevel: number,
  ) {
    const secondsBeforeStart = Math.floor(
      (reservation.startTime.getTime() - mostRecentOriginatedAt.getTime()) /
        1000,
    );
    const energyLossBeforeStart =
      EnergyCalculator.calcEnergyLossWhileLocked(secondsBeforeStart);
    const energyLossAfterStart = EnergyCalculator.calcEnergyLossWhileInSimulatedReservation(
      reservation.startTime,
      now,
      reservation,
    );

    const energyLevel = avgEnergyLevel - energyLossBeforeStart - energyLossAfterStart;

    this.updateBatteries(
      vehicle,
      energyLevel < 0 ? 0 : energyLevel,
    );
  }

  private updateWhenIntervalOverlapEndReservation(
    vehicle: Vehicle,
    reservation: Reservation,
    mostRecentOriginatedAt: Date,
    now: Date,
    avgEnergyLevel: number,
  ) {
    const energyLossBeforeEnd = EnergyCalculator.calcEnergyLossWhileInSimulatedReservation(
      mostRecentOriginatedAt,
      reservation.endTime,
      reservation,
    );
    const energyLossAfterEnd = EnergyCalculator.calcEnergyLossWhileLocked(
      Math.floor((now.getTime() - reservation.endTime.getTime()) / 1000),
    );

    const energyLevel = avgEnergyLevel - energyLossBeforeEnd - energyLossAfterEnd;

    this.updateBatteries(
      vehicle,
      energyLevel < 0 ? 0 : energyLevel,
    );
  }

  private updateBatteries(vehicle: Vehicle, energyLevel: number) {
    if (
      !Model.containsBatteries(vehicle.model) ||
      vehicle.model.batteries === undefined
    ) {
      return;
    }

    const batteriesCount = vehicle.model.batteries.batteries.length;

    for (let i = 0; i < batteriesCount; i++) {
      vehicle.model.batteries.batteries[i].level.state = energyLevel;
      vehicle.model.batteries.batteries[i].level.originatedAt = new Date();
    }
  }
}
