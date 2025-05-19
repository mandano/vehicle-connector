import { Request, Response, Router as ExpressRouter } from "express";
import { v4 as uuidv4 } from "uuid";

import { RouteInterface } from "../../RouteInterface.ts";
import VehicleRepositoryInterface from "../../../../../common/src/repositories/VehicleRepositoryInterface.ts";
import { ExchangeQueue } from "../../../../../common/src/adapters/queue/rabbitMq/ExchangeQueue.ts";
import { Lock as LockComponent } from "../../../../../common/src/vehicle/components/lock/Lock.ts";
import ContainsLockCheck from "../../../../../common/src/vehicle/components/lock/ContainsLockCheck.ts";

export class Unlock implements RouteInterface {
  private _path: string = "/vehicle/:id/unlock";
  private _vehicleRepository: VehicleRepositoryInterface;
  private _action_responses: ExchangeQueue;

  public constructor(
    vehicleRepository: VehicleRepositoryInterface,
    action_responses: ExchangeQueue,
  ) {
    this._vehicleRepository = vehicleRepository;
    this._action_responses = action_responses;
  }

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
     *         description: Vehicle does not support unlocking
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Vehicle does not support unlocking
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
    const vehicle = this._vehicleRepository.findById(vehicleId);

    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }

    if (!ContainsLockCheck.run(vehicle.model)) {
      res.status(422).json({ message: "Vehicle does not support unlocking" });
      return;
    }

    const actionResponsesQueueInitiated = await this._action_responses.init();

    if (actionResponsesQueueInitiated === false) {
      res.status(503).json({ message: "Service unavailable" });
      return;
    }

    const consumptionPromise = this._action_responses.consumeWithTimeout(20000, {
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
      res.status(503).json({
        message:
          "Vehicle could not be unlocked. Response stated failed unlocking.",
      });
      return;
    }

    res.status(200).json({ message: "Vehicle unlocked successfully" });
  }
}
