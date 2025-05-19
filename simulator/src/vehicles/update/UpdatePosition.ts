import { SimulatedVehicle } from "../SimulatedVehicle.ts";
import ContainsIot from "../../../../connector/common/src/vehicle/components/iot/ContainsIot.ts";

export class UpdatePosition {
  run(vehicle: SimulatedVehicle): void {
    if (
      !ContainsIot.run(vehicle.vehicle.model) ||
      vehicle.vehicle.model.ioT === undefined
    ) {
      return;
    }

    if (
      vehicle.vehicle.model.ioT.position === undefined ||
      vehicle.vehicle.model.ioT.position.latitude === undefined ||
      vehicle.vehicle.model.ioT.position.longitude === undefined
    ) {
      //TODO: add error log

      return;
    }

    if (vehicle.reservation === undefined) {
      vehicle.vehicle.model.ioT.position.latitude.originatedAt = new Date();
      vehicle.vehicle.model.ioT.position.longitude.originatedAt = new Date();

      return;
    }

    const currentWaypoint = vehicle.reservation.approxNearestWaypoint(
      new Date(),
    );

    vehicle.vehicle.model.ioT.position.latitude.state =
      currentWaypoint.latitude;
    vehicle.vehicle.model.ioT.position.longitude.state =
      currentWaypoint.longitude;
    vehicle.vehicle.model.ioT.position.latitude.originatedAt = new Date();
    vehicle.vehicle.model.ioT.position.longitude.originatedAt = new Date();
  }
}
