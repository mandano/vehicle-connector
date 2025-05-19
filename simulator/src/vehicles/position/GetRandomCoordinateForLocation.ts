import { point, destination } from "@turf/turf";

import { OpenStreetMap } from "../../adapters/OpenStreetMap.ts";

import { Location } from "./Location.ts";
import { Coordinate } from "./Coordinate.ts";

export class GetRandomCoordinateForLocation {
  private readonly _radiusInM: number;
  private _openStreetMap: OpenStreetMap;

  constructor(
    radiusInM: number,
    openStreetMap: OpenStreetMap,
  ) {
    this._radiusInM = radiusInM;
    this._openStreetMap = openStreetMap;
  }

  public async run(location: Location): Promise<Coordinate | undefined> {
    const randomBearing = Math.floor(Math.random() * 360);
    const randomRadius = Math.floor(Math.random() * this._radiusInM);

    const dest = destination(
      point([
        location.coordinate.longitude,
        location.coordinate.latitude,
      ]),
      randomRadius,
      randomBearing,
      {
        units: "meters",
      },
    );

    const snappedCoordinate = await this._openStreetMap.snapToStreet(
      dest.geometry.coordinates[1],
      dest.geometry.coordinates[0],
    );
    if (
      snappedCoordinate === undefined ||
      snappedCoordinate.latitude === undefined ||
      snappedCoordinate.longitude === undefined
    ) {
      return undefined;
    }

    return new Coordinate(
      snappedCoordinate.latitude,
      snappedCoordinate.longitude,
    );
  }
}
