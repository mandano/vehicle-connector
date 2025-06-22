import { Request, Response, Router as ExpressRouter } from "express";
import VehicleRepositoryHashableInterface from "common/src/repositories/vehicle/VehicleRepositoryHashableInterface.ts";

import { RouteInterface } from "../../RouteInterface.ts";
import {
  typeNames as modelTypeNames,
  names as modelNames,
} from "../../../../../common/src/vehicle/model/models/types.ts";

export class UpdateModelName implements RouteInterface {
  private _path: string = "/vehicle/:id/modelName";

  constructor(private readonly _vehicleRepository: VehicleRepositoryHashableInterface) {}

  public init(router: ExpressRouter) {
    /**
     * @swagger
     * /api/v1/vehicle/{id}/modelName:
     *   put:
     *     tags:
     *       - Vehicle
     *     summary: Updates the model name of a vehicle
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the vehicle
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               modelName:
     *                 type: string
     *                 description: The new model name of the vehicle
     *     responses:
     *       200:
     *         description: Model name updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Model name updated successfully
     *       400:
     *         description: Missing vehicle id, model name or invalid model name
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             examples:
     *               Missing vehicle id:
     *                 value:
     *                   message: Missing vehicle id
     *
     *               Missing model name:
     *                 value:
     *                   message: Missing model name
     *               Invalid model name:
     *                 value:
     *                   message: Invalid model name
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
     */
    router.put(this._path, async (req: Request, res: Response) => {
      await this.run(req, res);
    });
  }

  private async run(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    if (req.body === undefined) {
      res.status(400).json({ message: "Missing model name" });
      return;
    }
    const modelName = req.body.modelName;

    if (!this.isValidModelName(modelName)) {
      res.status(400).json({ message: "Invalid model name" });
      return;
    }

    if (!id) {
      res.status(400).json({ message: "Missing vehicle id" });
      return;
    }

    if (!modelName) {
      res.status(400).json({ message: "Missing model name" });
      return;
    }

    const vehicleId = parseInt(id);
    const hashable = await this._vehicleRepository.findById(vehicleId);
    const vehicle = hashable?.value;

    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }

    await this._vehicleRepository.updateModelName(
      vehicle.id,
      modelName,
      hashable?.hash,
    );

    res.status(200).json({ message: "Model name updated successfully" });
  }

  private isValidModelName(modelName: string): modelName is modelTypeNames {
    return modelNames.includes(modelName);
  }
}
