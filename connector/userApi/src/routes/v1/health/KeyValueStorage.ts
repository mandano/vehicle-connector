import { Request, Response, Router as ExpressRouter } from "express";
import ValkeyAdapterInterface from "common/src/adapters/valkey/ValkeyAdapterInterface.ts";

import RouteInterface from "../../RouteInterface.ts";

export default class KeyValueStorage implements RouteInterface {
  private _path: string = "/health/keyValueStorage";
  private static readonly STATUS_CONNECTED: string = "connected";
  private static readonly STATUS_DISCONNECTED: string = "disconnected";

  constructor(private readonly _valkeyAdapter: ValkeyAdapterInterface) {}

  public init(router: ExpressRouter) {
    /**
     * @swagger
     * /api/v1/health/keyValueStorage:
     *   get:
     *     tags:
     *       - Health
     *     summary: Check key-value storage connection status for the REST-API application (userApi).
     *     description: Returns the connection status of the key-value storage (Valkey)
     *     responses:
     *       200:
     *         description: Key-value storage is connected
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "connected"
     *       503:
     *         description: Key-value storage is disconnected
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "disconnected"
     */
    router.get(this._path, async (req: Request, res: Response) => {
      await this.run(req, res);
    });
  }

  private async run(req: Request, res: Response): Promise<void> {
    const connected = await this._valkeyAdapter.isConnected();

    if (connected === true) {
      res.status(200).json({
        status: KeyValueStorage.STATUS_CONNECTED,
      });
      return;
    }
    res.status(503).json({
      status: KeyValueStorage.STATUS_DISCONNECTED,
    });
  }
}
