import { Reservation } from "../../src/reservations/Reservation.ts";
import { Route } from "../../src/reservations/Route.ts";
import { Coordinate } from "../../src/vehicles/position/Coordinate.ts";
import { FakeLogger } from "../../../connector/common/test/logger/FakeLogger.ts";

export class CreateReservation {
  public run(options?: {
    startTime?: Date;
    durationInMilliSec?: number;
    distanceInMeters?: number;
  }): Reservation {
    const logger = new FakeLogger();
    const startTime = options?.startTime ?? new Date();
    const durationInMilliSec = options?.durationInMilliSec ?? 12 * 60 * 1000;
    const distance = options?.distanceInMeters ?? 1000;

    return new Reservation(
      1,
      startTime,
      new Route(
        [new Coordinate(0, 0), new Coordinate(1, 1)],
        distance,
        durationInMilliSec,
      ),
      logger,
    );
  }
}
