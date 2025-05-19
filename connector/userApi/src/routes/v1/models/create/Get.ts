import { Request, Response, Router as ExpressRouter } from "express";

import { RouteInterface } from "../../../RouteInterface.ts";
import Create from "../../../../../../common/src/vehicle/model/builders/create/Create.ts";

export default class Get implements RouteInterface {
  private _path: string = "/models/create";

  public init(router: ExpressRouter) {
    // can you create a swagger documentation for this endpoint
    /**
     * @swagger
     * /api/v1/models/create:
     *   get:
     *     tags:
     *       - Models
     *     summary: Get all available model types for vehicle creation.
     *     responses:
     *       200:
     *         description: List of available model types for vehicle creation.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: string
     */
    router.get(this._path, (req: Request, res: Response) => {
      this.run(req, res);
    });
  }

  private run(req: Request, res: Response): void {
    res.status(200).json(Create.MODEL_TYPES);
  }
}
