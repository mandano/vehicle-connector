import Vehicle from "../../types/vehicles/Vehicle";
import SimulatorApi from "../../api/simulator/SimulatorApi";
import GeoSpatial from "../../GeoSpatial";
import VehicleRoutes from "../../types/vehicles/VehicleRoutes";
import UserApi from "../../api/userApi/UserApi";
import Reservations from "../../types/reservations/Reservations";

export default class MapHelper {
  private static defaultLocation: [number, number] = [52.520008, 13.404954];

  constructor(
    private _geoSpatial: GeoSpatial,
    private _simulatorApi: SimulatorApi,
    private _userApi: UserApi,
  ) {}

  public getMapCenter(vehicles: Vehicle[]): [number, number] {
    if (vehicles.length === 0) return MapHelper.defaultLocation;

    const lats = vehicles
      .map((v) => v.model?.ioT?.position?.latitude.state)
      .filter((lat) => lat !== undefined && lat !== null);
    const lngs = vehicles
      .map((v) => v.model?.ioT?.position?.longitude.state)
      .filter((lng) => lng !== undefined && lng !== null);

    return [
      lats.reduce((a, b) => a + b, 0) / lats.length,
      lngs.reduce((a, b) => a + b, 0) / lngs.length,
    ];
  }

  public async loadVehicles(): Promise<Vehicle[]> {
    return await this._userApi.getVehicles();
  }

  public async loadRoutes(vehicles: Vehicle[]): Promise<VehicleRoutes> {
    const reservations = await this._simulatorApi.getReservations();

    if (reservations.length === 0) {
      console.error("Failed to fetch reservations");
      return {} as VehicleRoutes;
    }

    return this.setRoutes(vehicles, reservations);
  }

  private setRoutes(
    vehicles: Vehicle[],
    reservations: Reservations,
  ): VehicleRoutes {
    const routes: VehicleRoutes = {};
    reservations.forEach((reservation) => {
      const vehicle = vehicles.find((v) => {
        const imei = v.model.ioT?.network?.connectionModules?.[0]?.imei;

        return imei === reservation.imei;
      });

      if (!vehicle) return;

      const lat = vehicle.model?.ioT?.position?.latitude?.state;
      const lng = vehicle.model?.ioT?.position?.longitude?.state;

      if (!lat || !lng) return;

      const vehicleRoute = this._geoSpatial.splitRouteAtPoint(
        reservation.route.waypoints,
        [lat, lng],
      );

      if (!vehicleRoute) return;

      routes[vehicle.id] = vehicleRoute;
    });

    return routes;
  }
}
