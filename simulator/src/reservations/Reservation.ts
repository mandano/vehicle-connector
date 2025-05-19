import { Coordinate } from "../vehicles/position/Coordinate.ts";
import { LoggerInterface } from "../../../connector/common/src/logger/LoggerInterface.ts";

import { Route } from "./Route.ts";

export class Reservation {
  private readonly _id: number;
  private readonly _startTime: Date;
  private _endTime: Date;
  private readonly _route: Route;
  private _logger: LoggerInterface;

  constructor(
    id: number,
    startTime: Date,
    route: Route,
    logger: LoggerInterface,
  ) {
    this._id = id;
    this._startTime = startTime;
    this._endTime = new Date(this._startTime.getTime() + route.duration);
    this._route = route;
    this._logger = logger;
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
