import { Request, Response, Router as ExpressRouter } from "express";
import OrphanedSocketRepositoryInterface from "common/src/repositories/orphanedSocket/OrphanedSocketRepositoryInterface.ts";
import OrphanedSocketDto from "common/src/entities/OrphanedSocketDto.ts";

import RouteInterface from "../../RouteInterface.ts";

export default class Orphaned implements RouteInterface {
  private _path: string = "/sockets/orphaned";

  constructor(
    private readonly _orphanedSocketRepository: OrphanedSocketRepositoryInterface,
  ) {}

  public init(router: ExpressRouter) {
    /**
     * @swagger
     * /api/v1/sockets/orphaned:
     *   get:
     *     summary: Get all orphaned sockets
     *     description: Get all orphaned sockets
     *     tags:
     *       - Sockets
     *     responses:
     *       200:
     *         description: All orphaned sockets as list
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: ID of socket
     *                   ip:
     *                     type: string
     *                     description: IP address of socket
     *                   applicationName:
     *                     type: string
     *                     description: name of tcpInterface application
     *                   createdAt:
     *                     type: string
     *                     format: date-time
     *                     description: creation date of socket
     *       503:
     *         description: List could not been fetched, storage issue.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Error message
     */
    router.get(this._path, async (req: Request, res: Response) => {
      await this.run(req, res);
    });
  }

  /**
   * TODO: pagination needed
   *
   * @param req
   * @param res
   * @private
   */
  private async run(req: Request, res: Response): Promise<void> {
    const orphanedSockets = await this._orphanedSocketRepository.getAll();

    if (orphanedSockets === undefined) {
      res.status(503);
      return;
    }

    const orphanedSocketsDtos: OrphanedSocketDto[] = [];

    for (const orphanedSocket of orphanedSockets) {
      orphanedSocketsDtos.push(
        new OrphanedSocketDto(
          orphanedSocket.id,
          orphanedSocket.ip,
          orphanedSocket.applicationName,
          orphanedSocket.createdAt,
        ),
      );
    }

    res.status(200).json(orphanedSocketsDtos);
  }
}
