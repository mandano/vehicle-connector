import { Request, Response, Router as ExpressRouter } from "express";
import ContainsNetwork from "common/src/vehicle/components/iot/network/ContainsNetwork.ts";
import VehicleRepositoryHashableInterface from "common/src/repositories/vehicle/VehicleRepositoryHashableInterface.ts";
import { CreateLockableScooter } from "common/src/vehicle/model/builders/create/lockableScooter/CreateLockableScooter.ts";

import { RouteInterface } from "../../RouteInterface.ts";
import CreateModel from "../../../../../common/src/vehicle/model/builders/create/Create.ts";
import ValidateOptions from "../../../../../common/src/vehicle/model/builders/create/lockableScooter/ValidateOptions.ts";

export default class Create implements RouteInterface {
  private _path: string = "/vehicle/create";

  public constructor(
    private _vehicleValkeyRepository: VehicleRepositoryHashableInterface,
  ) {}

  public init(router: ExpressRouter) {
    /**
     * @swagger
     * /api/v1/vehicle/create:
     *   post:
     *     tags:
     *       - Vehicle
     *     summary: Create a new vehicle
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               imei:
     *                 type: string
     *               modelName:
     *                 type: string
     *               modelContent:
     *                 type: object
     *             required:
     *               - imei
     *               - modelName
     *               - modelContent
     *     responses:
     *       201:
     *         description: Vehicle created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Vehicle created
     *                 id:
     *                   type: integer
     *                   example: 1
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 messages:
     *                   type: array
     *                   items:
     *                     type: string
     *                   examples:
     *                     - Missing modelName
     *                     - Invalid modelName
     *                     - Invalid model attribute
     *       409:
     *         description: Conflict
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 messages:
     *                   type: array
     *                   items:
     *                     type: string
     *                   examples:
     *                     - Vehicle already exists
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Vehicle not created
     */
    router.post(this._path, async (req: Request, res: Response) => {
      await this.run(req, res);
    });
  }

  private async run(req: Request, res: Response): Promise<void> {
    const modelName = req.body.modelName;
    const modelContent = req.body.modelContent;

    if (!modelName) {
      res.status(400).json({ message: "Missing modelName" });
      return;
    }

    if (!modelContent) {
      res.status(400).json({ message: "Missing modelContent" });
      return;
    }

    const createModel = new CreateModel(
      new CreateLockableScooter(),
      new ValidateOptions(),
    );

    const model = createModel.run(modelName, modelContent);

    if (model === undefined) {
      res.status(400).json({ message: createModel.errors });
      return;
    }

    if (
      ContainsNetwork.run(model) &&
      model.network !== undefined &&
      model.network.containsModules()
    ) {
      const found = await this._vehicleValkeyRepository.findByImei(
        model.network.connectionModules[0].imei,
      );

      if (found !== undefined) {
        res.status(409).json({ message: "Vehicle already exists" });
        return;
      }
    }

    const vehicleId = await this._vehicleValkeyRepository.create(model);

    if (vehicleId === undefined) {
      res.status(500).json({ message: "Vehicle not created" });
      return;
    }

    res.status(201).json({ message: "Vehicle created", id: vehicleId });
  }
}
