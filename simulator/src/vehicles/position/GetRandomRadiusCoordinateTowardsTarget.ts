import { destination, bearing } from "@turf/turf";
import { point } from "@turf/helpers";

import { Coordinate } from "./Coordinate.ts";

export class GetRandomRadiusCoordinateTowardsTarget {
  private readonly _radiusInM: number;
  private readonly _biasStrength: number; // Strength of the bias (0-1)

  constructor(radiusInM: number, biasStrength: number) {
    this._radiusInM = radiusInM;
    this._biasStrength = biasStrength
  }

  public run(coordinate: Coordinate, targetCoordinate: Coordinate): Coordinate {
    const targetBearing = bearing(
      point([coordinate.latitude, coordinate.longitude]),
      point([targetCoordinate.latitude, targetCoordinate.longitude])
    );

    const randomBearing = Math.random() * 360;
    const biasedBearing = targetBearing + (randomBearing - targetBearing) * (1 - this._biasStrength);


    const dest = destination(
      point([coordinate.latitude, coordinate.longitude]),
      this._radiusInM,
      biasedBearing,
      {
        units: "meters",
      },
    );

    return new Coordinate(
      dest.geometry.coordinates[0],
      dest.geometry.coordinates[1],
    );
  }
}
