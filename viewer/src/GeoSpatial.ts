import { point, distance } from "@turf/turf";

import Waypoints from "./types/Waypoints";
import Waypoint from "./types/Waypoint";
import VehicleRouteDto from "./types/vehicles/VehicleRouteDto";

export default class GeoSpatial {
  private getPoint(lat: number, lng: number) {
    return point([lng, lat]);
  }

  public splitRouteAtPoint(route: Waypoints, splitPoint: Waypoint): VehicleRouteDto | undefined {
    if (route.length === 0) {
      return undefined;
    }

    let closestIndex = -1;
    let minDistance = Number.MAX_VALUE;
    const target = this.getPoint(splitPoint[0], splitPoint[1]);

    route.forEach((wp, index) => {
      const current = point([wp[1], wp[0]]); // Turf nutzt [lng, lat]
      const dist = distance(target, current);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = index;
      }
    });

    const traveledRoute = route.slice(0, closestIndex);
    const traveledRouteIncludingVehicle = traveledRoute.concat([splitPoint]);
    const remainingRoute = route.slice(closestIndex);
    const remainingRouteIncludingVehicle = [splitPoint].concat(remainingRoute);

    return new VehicleRouteDto(
      traveledRouteIncludingVehicle,
      remainingRouteIncludingVehicle
    )
  }
}
