import { Coordinate } from "../vehicles/position/Coordinate.ts";
import { Route } from "../reservations/Route.ts";

export interface RouterInterface {
  route(
    profile: "car" | "bike",
    points: Coordinate[],
  ): Promise<Route | undefined>;
}
