import LoggerInterface from "common/src/logger/LoggerInterface.ts";

import Coordinate from "../vehicles/position/Coordinate.ts";

import Route from "./Route.ts";

export class Reservation {
  private _endTime: Date;

  constructor(
    private readonly _id: number,
    private readonly _startTime: Date,
    private readonly _route: Route,
    private _logger: LoggerInterface,
  ) {
    this._endTime = new Date(this._startTime.getTime() + this._route.duration);
  }

  get id(): number {
    return this._id;
  }

  get startTime(): Date {
    return this._startTime;
  }

  get endTime(): Date {
    return this._endTime;
  }

  set endTime(value: Date) {
    this._endTime = value;
  }

  get route(): Route {
    return this._route;
  }

  public approxNearestWaypoint(time: Date): Coordinate {
    if (time < this._startTime) {
      return this._route.waypoints[0];
    } else if (time > this._endTime) {
      return this._route.waypoints[this._route.waypoints.length - 1];
    }

    const timeDiff = time.getTime() - this._startTime.getTime();
    const completedInPercentage = timeDiff / this._route.duration;
    const waypointIndex = Math.floor(
      completedInPercentage * (this._route.waypoints.length - 1),
    );

    this._logger.debug(
      `Reservation - wp reached: ${waypointIndex}, wp max: ${this._route.waypoints.length - 1}`,
    );

    if (waypointIndex >= this._route.waypoints.length - 1) {
      this._logger.error(
        `${waypointIndex}, ${this._route.waypoints.length - 1}`,
      );

      return this._route.waypoints[this._route.waypoints.length - 1];
    }

    return this._route.waypoints[waypointIndex];
  }
}

export default Reservation;
