import Waypoints from "../Waypoints";

export default class VehicleRouteDto {
  constructor(
    public readonly traveled: Waypoints,
    public readonly remaining: Waypoints,
  ) {}
}
