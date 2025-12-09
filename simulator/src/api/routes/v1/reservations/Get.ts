import { Request, Response, Router as ExpressRouter } from "express";
import RouteInterface from "userapi/src/routes/RouteInterface.ts";

import ManageReservations from "../../../../reservations/manage/Manage.ts";
import ReservationDto from "../../../../reservations/ReservationDto.ts";
import RouteDto from "../../../../reservations/RouteDto.ts";
import CoordinateDto from "../../../../vehicles/position/CoordinateDto.ts";
import ReservationWithVehicleDto from "../../../../reservations/ReservationWithVehicleDto.ts";

export default class Get implements RouteInterface {
  private _path: string = "/reservations";

  constructor(private readonly _manageReservations: ManageReservations) {}

  public init(router: ExpressRouter) {
    /**
     * @swagger
     * /api/v1/reservations:
     *   get:
     *     tags:
     *       - Reservations
     *     summary: Returns running reservations.
     *     responses:
     *       200:
     *         description: All running reservations.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Hello, world!
     */
    router.get(this._path, async (req: Request, res: Response) => {
      await this.run(req, res);
    });
  }

  private async run(req: Request, res: Response): Promise<void> {
    const simulatedVehicles = this._manageReservations.findVehiclesWithRunningReservation();

    const reservationsOut: ReservationDto[] = [];

    simulatedVehicles.forEach(vehicle => {
      if (!vehicle.reservation) {return;}

      const waypointDtos = vehicle.reservation.route.waypoints.map(waypoint =>
        new CoordinateDto(waypoint.latitude, waypoint.longitude),
      );

      const routeDto = new RouteDto(
        waypointDtos,
        vehicle.reservation.route.distance,
        vehicle.reservation.route.duration,
        vehicle.reservation.route.avgSpeed,
      );

      const imei = vehicle.vehicle.model.ioT?.network?.getImeiOfFirstConnectionModule();

      const reservationDto = new ReservationWithVehicleDto(
        vehicle.reservation.id,
        vehicle.reservation.startTime,
        vehicle.reservation.endTime,
        routeDto,
        vehicle.vehicle.id,
        imei ?? undefined
      );
      reservationsOut.push(reservationDto);
    })

    res.status(200).json(reservationsOut);
  }
}
