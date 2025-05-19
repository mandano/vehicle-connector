import { Coordinate } from "../vehicles/position/Coordinate.ts";
import { Route } from "../reservations/Route.ts";

import { RouterInterface } from "./RouterInterface.ts";

export class Graphhopper implements RouterInterface {
  private _apiKey: string;

  constructor(apiKey: string) {
    this._apiKey = apiKey;
  }

  /**
   * https://docs.graphhopper.com/#operation/getRoute
   *
   * @param profile
   * @param points
   */
  public async route(
    profile: "car" | "bike",
    points: Coordinate[],
  ): Promise<Route | undefined> {
    const urlSearchParams = new URLSearchParams({
      profile: profile,
      //point_hint: 'string',
      //snap_prevention: 'string',
      //curbside: 'any',
      //locale: 'en',
      elevation: "false",
      //details: "time,distance",
      optimize: "false",
      instructions: "false",
      calc_points: "true",
      debug: "false",
      points_encoded: "false",
      "ch.disable": "false",
      //heading: '0',
      //heading_penalty: '300',
      //pass_through: 'false',
      //algorithm: 'round_trip',
      //'round_trip.distance': '10000',
      //'round_trip.seed': '0',
      //'alternative_route.max_paths': '2',
      //'alternative_route.max_weight_factor': '1.4',
      //'alternative_route.max_share_factor': '0.6',
      key: this._apiKey,
    });
    // loop over points with for of
    for (const point of points) {
      urlSearchParams.append(`point`, `${point.latitude},${point.longitude}`);
    }

    const query = urlSearchParams.toString();

    const url = `https://graphhopper.com/api/1/route?${query}`;

    let resp: Response;
    try {
      resp = await fetch(url, {
        method: "GET",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return undefined;
    }

    if (resp.status !== 200) {
      return undefined;
    }

    const contentType = resp.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return undefined;
    }

    const responseAsJson = await resp.json();
    if (!responseAsJson.paths && responseAsJson.paths.length === 0) {
      return undefined;
    }

    if (
      !responseAsJson.paths[0].points &&
      !responseAsJson.paths[0].points.coordinates &&
      responseAsJson.paths[0].points.coordinates.length === 0
    ) {
      return undefined;
    }

    if (!responseAsJson.paths[0].distance) {
      return undefined;
    }

    if (!responseAsJson.paths[0].time) {
      return undefined;
    }

    const coordinates: Coordinate[] = [];
    for (const coordinate of responseAsJson.paths[0].points.coordinates) {
      coordinates.push(new Coordinate(coordinate[1], coordinate[0]));
    }

    return new Route(
      coordinates,
      responseAsJson.paths[0].distance,
      responseAsJson.paths[0].time,
    );
  }
}
