import { Request, Response, Router as ExpressRouter } from "express";
import LoggerInterface from "common/src/logger/LoggerInterface.ts";
import VehicleRepositoryHashableInterface from "common/src/repositories/vehicle/VehicleRepositoryHashableInterface.ts";

import { RouteInterface } from "../../RouteInterface.ts";

export default class IsConnected implements RouteInterface {
  private _path: string = "/vehicle/:id([0-9]{1,6})/isConnected";

  constructor(
    private _vehicleRepository: VehicleRepositoryHashableInterface,
    private _logger: LoggerInterface,
  ) {}

  public init(router: ExpressRouter) {
    /**
     * @swagger
     * /api/v1/vehicle/{id}/isConnected:
     *   get:
     *     tags:
     *       - Vehicle
     *     summary: Checks if a vehicle is connected
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the vehicle
     *     responses:
     *       200:
     *         description: Vehicle connection status
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   oneOf:
     *                   - title: Connected
     *                     const: "Vehicle is connected"
     *                   - title: Disconnected
     *                     const: "Vehicle is not connected"
     *                 details:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       imei:
     *                         type: string
     *                         example: "123456789012345"
     *                       state:
     *                         type: string
     *                         examples:
     *                           Connected:
     *                             value: connected
     *                           Disconnected:
     *                             value: disconnected
     *       400:
     *         description: Missing vehicle id
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Missing vehicle id
     *       404:
     *         description: Vehicle not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Vehicle not found
     *       422:
     *         description: Vehicle does not support IoT or network setup
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   examples:
     *                     noIoT:
     *                       value: No IoT setup
     *                     NoNetwork:
     *                       value: No network setup
     */
    router.get(this._path, async (req: Request, res: Response) => {
      await this.run(req, res);
    });
  }

  private async run(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ message: "Missing vehicle id" });
    }

    const vehicleId = parseInt(id);

    const hashable = await this._vehicleRepository.findById(vehicleId);
    const vehicle = hashable?.value;

    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }

    if (!vehicle.model.ioT) {
      res.status(422).json({ message: "No IoT setup" });
      return;
    }

    if (!vehicle.model.ioT.network) {
      res.status(422).json({ message: "No network setup" });
      return;
    }

    const isConnected = vehicle.model.ioT.network.isConnected();

    if (isConnected === false) {
      res.status(200).json({ message: "Vehicle is not connected" });
      return;
    }

    const connectedModules = vehicle.model.ioT.network.getConnectedModules();
    if (connectedModules === undefined || connectedModules.length === 0) {
      this._logger.error(
        `Inconsistent vehicle ${vehicleId}, isConnected true, but no connected modules listable.`,
      );
      res.status(200).json({ message: "Vehicle is not connected" });
      return;
    }

    const details = connectedModules.map((module) => ({
      imei: module.imei,
      state: module.state?.state.state,
      originatedAt: module.state?.state.originatedAt,
    }));

    const body = { message: "Vehicle is connected", details: details };

    res.status(200).json(body);
  }
}
