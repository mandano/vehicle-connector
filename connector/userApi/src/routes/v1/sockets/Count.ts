import { Request, Response, Router as ExpressRouter } from "express";
import ImeiSocketIdRepositoryInterface from "common/src/repositories/imeiSocketId/ImeiSocketIdRepositoryInterface.ts";

import RouteInterface from "../../RouteInterface.ts";

export default class Count implements RouteInterface {
  private _path: string = "/sockets/count";

  constructor(
    private readonly _imeiSocketIdRepository: ImeiSocketIdRepositoryInterface,
  ) {}

  public init(router: ExpressRouter) {
    /**
     * @swagger
     * /api/v1/sockets/count:
     *   get:
     *     summary: Get socket count
     *     description: Retrieves the total number of active sockets
     *     tags:
     *       - Sockets
     *     responses:
     *       200:
     *         description: Successfully retrieved socket count
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 count:
     *                   type: integer
     *                   description: The total number of active sockets
     *                   example: 42
     *       503:
     *         description: Service unavailable - unable to retrieve socket count
     */
    router.get(this._path, async (req: Request, res: Response) => {
      await this.run(req, res);
    });
  }

  private async run(req: Request, res: Response): Promise<void> {
    const count = await this._imeiSocketIdRepository.getCount();

    if (count === undefined) {
      res.status(503);
      return;
    }

    res.status(200).json({
      count: count,
    });
  }
}
