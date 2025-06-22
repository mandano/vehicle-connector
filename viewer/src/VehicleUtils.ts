import Vehicle from "./types/Vehicle";
import Waypoints from "./types/Waypoints";

export default class VehicleUtils {
  public static setRoutes(
    vehicles: Vehicle[],
    prevRoutes: Record<string, Waypoints>,
  ) {
    const newRoutes = { ...prevRoutes };

    vehicles.forEach((vehicle) => {
      const model = vehicle.model;

      if (!model) {
        return;
      }

      const isLocked = model.lock?.state.state === "locked";
      const vehicleId = vehicle.id;

      if (isLocked && newRoutes[vehicleId]) {
        delete newRoutes[vehicleId];
        return;
      }

      const lat = model.ioT?.position?.latitude?.state;
      const lng = model.ioT?.position?.longitude?.state;

      if (!lat || !lng) return;

      if (
        prevRoutes[vehicleId] &&
        prevRoutes[vehicleId].length > 0 &&
        lat === prevRoutes[vehicleId][prevRoutes[vehicleId].length - 1][0] &&
        lng === prevRoutes[vehicleId][prevRoutes[vehicleId].length - 1][1]
      ) {
        return;
      }

      const currentRoute = prevRoutes[vehicleId] || [];
      const newRoute = [...currentRoute, [lat, lng]];
      newRoutes[vehicleId] = newRoute.slice(-100) as Waypoints;
    });

    return newRoutes;
  }
}
