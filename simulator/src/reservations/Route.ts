import { Coordinate } from "../vehicles/position/Coordinate.ts";

export class Route {
  private readonly _waypoints: Coordinate[];
  private readonly _distance: number; // in meters
  private readonly _duration: number; // in milliseconds TODO: use seconds to be consisten across project?!
  private readonly _avgSpeed: number; // m/s

  constructor(
    waypoints: Coordinate[],
    distance: number,
    durationInMilliseconds: number,
  ) {
    this._waypoints = waypoints;
    this._distance = distance;
    this._duration = durationInMilliseconds;
    this._avgSpeed = this._distance / this._duration / 1000;
  }

  get waypoints(): Coordinate[] {
    return this._waypoints;
  }

  get distance(): number {
    return this._distance;
  }

  get duration(): number {
    return this._duration;
  }

  get avgSpeed(): number {
    return this._avgSpeed;
  }
}
