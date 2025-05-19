import { Request, Response, Router as ExpressRouter } from "express";

import { RouteInterface } from "../../RouteInterface.ts";
import RabbitMqConnection from "../../../../../common/src/adapters/queue/rabbitMq/RabbitMqConnection.ts";

export class Queue implements RouteInterface {
  private _path: string = "/health/queue";
  private static readonly STATUS_OPERATIONAL: string = "operational";
  private static readonly STATUS_DISCONNECTED: string = "disconnected";
  private static readonly ATTEMPT_THRESHOLD: number = 5000;

  constructor(private readonly _rabbitMqConnection: RabbitMqConnection) {}

  public init(router: ExpressRouter) {
    /**
     * @swagger
     * /api/v1/health/queue:
     *   get:
     *     tags:
     *       - Health
     *     summary: Check RabbitMQ connection status for the REST-API application (userApi).
     *     responses:
     *       200:
     *         description: RabbitMQ connection is operational.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: operational
     *                 establishedAt:
     *                   type: string
     *                   format: date-time
     *                   description: Timestamp when the connection was established.
     *       503:
     *         description: RabbitMQ connection is disconnected.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: disconnected
     *                 attemptedAt:
     *                   type: string
     *                   format: date-time
     *                   description: Timestamp of the last connection attempt.
     *                 error:
     *                   type: string
     *                   description: Error message from the last connection attempt.
     */
    router.get(this._path, async (req: Request, res: Response) => {
      await this.run(req, res);
    });
  }

  private async run(req: Request, res: Response): Promise<void> {
    const connected = this._rabbitMqConnection.connected;
    const sinceLastConnectionAttempt =
      this._rabbitMqConnection.attemptAt !== undefined
        ? this._rabbitMqConnection.attemptAt.getTime() - new Date().getTime()
        : undefined;

    if (
      connected === false &&
      (sinceLastConnectionAttempt === undefined ||
        sinceLastConnectionAttempt > Queue.ATTEMPT_THRESHOLD)
    ) {
      this._rabbitMqConnection.init().then();
    }

    if (connected === true) {
      res.status(200).json({
        status: Queue.STATUS_OPERATIONAL,
        establishedAt: this._rabbitMqConnection.establishedAt,
      });
      return;
    }
    res
      .status(503)
      .json({
        status: Queue.STATUS_DISCONNECTED,
        attemptedAt: this._rabbitMqConnection.attemptAt,
        error: this._rabbitMqConnection.error,
      });
  }
}
