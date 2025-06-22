import { Request, Response, Router as ExpressRouter } from "express";
import { v4 as uuidv4 } from "uuid";
import LoggerInterface from "common/src/logger/LoggerInterface.ts";
import Channel from "common/src/adapters/queue/rabbitMq/Channel.ts";
import OnMessageInterfaceV2 from "common/src/adapters/queue/OnMessageInterfaceV2.ts";
import Exchange from "common/src/adapters/queue/rabbitMq/Exchange.ts";
import { ExchangeQueue } from "common/src/adapters/queue/rabbitMq/ExchangeQueue.ts";
import VehicleRepositoryHashableInterface from "common/src/repositories/vehicle/VehicleRepositoryHashableInterface.ts";
import ContainsIot from "common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "common/src/vehicle/components/iot/network/ContainsNetwork.ts";

import { RouteInterface } from "../../RouteInterface.ts";
import { Lock as LockComponent } from "../../../../../common/src/vehicle/components/lock/Lock.ts";
import ContainsLockCheck from "../../../../../common/src/vehicle/components/lock/ContainsLockCheck.ts";

export class Unlock implements RouteInterface {
  private _path: string = "/vehicle/:id/unlock";

  public constructor(
    private readonly _vehicleRepository: VehicleRepositoryHashableInterface,
    private readonly _channel: Channel,
    private readonly _handleResponse: OnMessageInterfaceV2,
    private readonly _exchange: Exchange,
    private readonly _applicationName: string,
    private readonly _logger: LoggerInterface,
  ) {}

  public init(router: ExpressRouter) {
    /**
     * @swagger
     * /api/v1/vehicle/{id}/unlock:
     *   post:
     *     tags:
     *       - Vehicle
     *     summary: Unlocks a vehicle
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the vehicle
     *       - in: query
     *         name: trackingId
     *         required: false
     *         schema:
     *           type: string
     *         description: Will be passed on throughout the system, if passable to vehicle, it can be found in webhook.
     *     responses:
     *       200:
     *         description: Vehicle unlocked successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Vehicle unlocked successfully
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
     *          description: Vehicle does not support required functionality
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  message:
     *                    type: string
     *              examples:
     *                No unlock support:
     *                  value:
     *                    message: Vehicle does not support unlocking
     *                No IoT support:
     *                  value:
     *                    message: Vehicle does not support IoT
     *                No network support:
     *                  value:
     *                    message: Vehicle does not support network
     *       503:
     *         description: Service unavailable
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *             examples:
     *               Not forwarded:
     *                 value:
     *                   message: Vehicle could not be unlocked. Unlock request not forwarded.
     *               Unlock failed:
     *                 value:
     *                   message: Vehicle could not be unlocked. Response stated failed unlocking.
     *               Vehicle is not connected:
     *                 value:
     *                   message: Vehicle is not connected
     */
    router.post(this._path, async (req: Request, res: Response) => {
      await this.run(req, res);
    });
  }

  private async run(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const trackingIdFromRequest = req.body.trackingId;

    if (!id) {
      res.status(400).json({ message: "Missing vehicle id" });
      return;
    }

    const vehicleId = parseInt(id);
    const hashable = await this._vehicleRepository.findById(vehicleId);
    const vehicle = hashable?.value;

    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }

    if (
      !ContainsLockCheck.run(vehicle.model) ||
      !vehicle.model.lock.unlockingSupported()
    ) {
      res.status(422).json({ message: "Vehicle does not support unlocking" });
      return;
    }

    if (!ContainsIot.run(vehicle.model) || vehicle.model.ioT === undefined) {
      res.status(422).json({ message: "Vehicle does not support IoT" });
      return;
    }

    if (
      !ContainsNetwork.run(vehicle.model.ioT) ||
      vehicle.model.ioT.network === undefined
    ) {
      res.status(422).json({ message: "Vehicle does not support network" });
      return;
    }

    if (!vehicle.model.ioT.network.isConnected()) {
      this._logger.warn(
        `Vehicle is not connected; vehicle id: ${vehicle.id}`,
        Unlock.name,
      );
      res.status(503).json({ message: "Vehicle is not connected" });
      return;
    }

    const actionResponses = new ExchangeQueue(
      this._channel,
      this._handleResponse,
      this._handleResponse,
      this._exchange,
      this._applicationName,
      this._logger,
      true,
    );

    const actionResponsesQueueInitiated = await actionResponses.init();

    if (actionResponsesQueueInitiated === false) {
      res.status(503).json({ message: "Service unavailable" });
      return;
    }

    const consumptionPromise = actionResponses.consumeWithTimeout(20000, {
      vehicleId: vehicle.id,
      targetState: LockComponent.UNLOCKED,
    });

    const trackingId = trackingIdFromRequest ?? uuidv4();
    const forwardedUnlock = await vehicle.model.lock.unlock(
      trackingId,
      vehicle.id,
    );

    if (!forwardedUnlock) {
      res.status(503).json({
        message: "Vehicle could not be unlocked. Unlock request not forwarded.",
      });
      return;
    }

    const unlocked = await consumptionPromise;

    if (!unlocked) {
      this._logger.info(
        `Unlock failed; vehicle id: ${vehicle.id}`,
        Unlock.name,
      );

      res.status(503).json({
        message:
          "Vehicle could not be unlocked. Response stated failed unlocking.",
      });
      return;
    }

    res.status(200).json({ message: "Vehicle unlocked successfully" });
  }
}
