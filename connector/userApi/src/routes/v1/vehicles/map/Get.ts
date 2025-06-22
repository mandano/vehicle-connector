import { Request, Response, Router as ExpressRouter } from "express";
import VehicleRepositoryHashableInterface from "common/src/repositories/vehicle/VehicleRepositoryHashableInterface.ts";

import { RouteInterface } from "../../../RouteInterface.ts";

export class Get implements RouteInterface {
  private _path: string = "/vehicles/map";

  constructor(private readonly _vehicleRepository: VehicleRepositoryHashableInterface) {}

  public init(router: ExpressRouter) {
    /**
     * @swagger
     * /api/v1/vehicles/map:
     *   get:
     *     tags:
     *       - Vehicles
     *     summary: Returns vehicle information for multiple vehicles, containing attributes needed for map view.
     *     parameters:
     *       - in: path
     *         name: from
     *         required: false
     *         schema:
     *           type: number
     *         description: The index of the first vehicle to return
     *       - in: path
     *         name: to
     *         required: false
     *         schema:
     *           type: number
     *         description: The index of the last vehicle to return
     *     responses:
     *       200:
     *         description: All vehicles
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
    // TODO: remove id hardcoding
    const hashables = await this._vehicleRepository.findAllStorageObject(0, 500);
    const vehicles = hashables.map((hashable) => hashable.value);

    res.status(200).json(vehicles);
  }
}
