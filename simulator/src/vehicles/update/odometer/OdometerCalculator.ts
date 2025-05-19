import { Reservation } from "../../../reservations/Reservation.ts";

export class OdometerCalculator {
  public static calcDrivenDistanceForIntervalDuringReservation(
    start: Date,
    end: Date,
    reservation: Reservation,
  ) {
    const reservationTimeElapsed =
      end.getTime() - start.getTime();
    const reservationTotalTime =
      reservation.endTime.getTime() - reservation.startTime.getTime();
    const reservationElapsedSinceLastUpdateInPercentage =
      reservationTimeElapsed / reservationTotalTime;

    return reservationElapsedSinceLastUpdateInPercentage * reservation.route.distance;
  }
}
