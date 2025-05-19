import { Model } from "../../../../connector/common/src/vehicle/model/models/Model.ts";
import { SimulatedVehicle } from "../SimulatedVehicle.ts";


export class UpdateSpeedometer {
  run(vehicle: SimulatedVehicle): void {
    if (
      !Model.containsSpeedometer(vehicle.vehicle.model) ||
      vehicle.vehicle.model.speedometer === undefined
    ) {
      return;
    }

    if (
      vehicle.vehicle.model.speedometer.state === undefined
    ) {
      //TODO: add error log

      return;
    }

    if (vehicle.reservation === undefined) {
      vehicle.vehicle.model.speedometer.state.state = 0;

      return;
    }

    vehicle.vehicle.model.speedometer.state.state = vehicle.reservation.route.avgSpeed;
  }
}
