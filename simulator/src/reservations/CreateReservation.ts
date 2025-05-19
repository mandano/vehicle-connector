import { Coordinate } from "../vehicles/position/Coordinate.ts";
import { RouterInterface } from "../adapters/RouterInterface.ts";
import { Types as GraphhopperVehicleTypes } from "../adapters/graphhopper/VehicleTypes.ts";
import { LoggerInterface } from "../../../connector/common/src/logger/LoggerInterface.ts";

import { Reservation } from "./Reservation.ts";

export class CreateReservation {
  private _router: RouterInterface;
  private readonly _logger: LoggerInterface;

  constructor(router: RouterInterface, logger: LoggerInterface) {
    this._router = router;
    this._logger = logger;
  }

  public async run(
    reservationId: number,
    start: Coordinate,
    end: Coordinate,
    vehicleType: GraphhopperVehicleTypes,
  ): Promise<Reservation | undefined> {
    const route = await this._router.route(vehicleType, [start, end]);

    if (route === undefined) {
      return undefined;
    }

    return new Reservation(reservationId, new Date(), route, this._logger);
  }
}
