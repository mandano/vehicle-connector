import { Reservation } from "../../../reservations/Reservation.ts";

export class EnergyCalculator {
  /**
   * Idle/Locked for 24 hours: 6.7% - 33.3%, using 7 %
   */
  private static _energyLossPerSecondInPercentageWhileLocked = 0.000000810185185;

  /**
   * 0.0028% to 0.0056% per meter
   */
  public static energyLossPerMeterInPercentageWhileUnlocked = 0.0028;

  public static calcEnergyLossWhileLocked(secondsSinceLastUpdate: number) {
    return (
      EnergyCalculator._energyLossPerSecondInPercentageWhileLocked *
      secondsSinceLastUpdate
    );
  }

  public static calcEnergyLossWhileInSimulatedReservation(
    start: Date,
    end: Date,
    reservation: Reservation,
  ) {
    const reservationTimeElapsedSinceLastUpdate =
      end.getTime() - start.getTime();
    const reservationTotalTime =
      reservation.endTime.getTime() - reservation.startTime.getTime();
    const reservationElapsedSinceLastUpdateInPercentage =
      reservationTimeElapsedSinceLastUpdate / reservationTotalTime;

    const metersElapsedSinceLastUpdate =
      reservationElapsedSinceLastUpdateInPercentage *
      reservation.route.distance;
    return (
      EnergyCalculator.energyLossPerMeterInPercentageWhileUnlocked *
      metersElapsedSinceLastUpdate
    );
  }
}
