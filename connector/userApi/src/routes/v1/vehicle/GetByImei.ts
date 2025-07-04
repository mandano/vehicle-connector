import { Request, Response, Router as ExpressRouter } from "express";
import VehicleRepositoryHashableInterface from "common/src/repositories/vehicle/VehicleRepositoryHashableInterface.ts";

import { RouteInterface } from "../../RouteInterface.ts";

export class GetByImei implements RouteInterface {
  private _path: string = "/vehicle/:imei([a-zA-Z0-9]{15})";

  constructor(private readonly _vehicleRepository: VehicleRepositoryHashableInterface) {}

  public init(router: ExpressRouter) {
    /**
     * @swagger
     * components:
     *   schemas:
     *     StateObject:
     *       type: object
     *       properties:
     *         state:
     *           type: [string, number, integer, boolean]
     *         originatedAt:
     *           type: string
     *           format: date-time
     *         updatedAt:
     *           type: string
     *           format: date-time
     *         createdAt:
     *           type: string
     *           format: date-time
     * /api/v1/vehicle/{imei}:
     *   get:
     *     tags:
     *       - Vehicle
     *     summary: Returns vehicle information for a certain vehicle by imei
     *     parameters:
     *       - in: path
     *         name: imei
     *         required: true
     *         schema:
     *           type: string
     *         description: Imei of the vehicle
     *     responses:
     *       200:
     *         description: All info about the vehicle
     *         content:
     *           application/json:
     *            schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 model:
     *                   type: object
     *                   properties:
     *                     modelName:
     *                       type: string
     *                       example: "LockableScooter"
     *                     energy:
     *                       type: object
     *                       properties:
     *                         batteries:
     *                           type: array
     *                           items:
     *                             type: object
     *                             properties:
     *                               voltage:
     *                                 type: object
     *                                 properties:
     *                                   state:
     *                                     type: integer
     *                                     example: 36102
     *                                   originatedAt:
     *                                     type: string
     *                                     format: date-time
     *                                   updatedAt:
     *                                     type: string
     *                                     format: date-time
     *                                   createdAt:
     *                                     type: string
     *                                     format: date-time
     *                               level:
     *                                 type: object
     *                                 properties:
     *                                   state:
     *                                     type: integer
     *                                     example: 99
     *                                   originatedAt:
     *                                     type: string
     *                                     format: date-time
     *                                   updatedAt:
     *                                     type: string
     *                                     format: date-time
     *                                   createdAt:
     *                                     type: string
     *                                     format: date-time
     *                     ioT:
     *                       type: object
     *                       properties:
     *                         network:
     *                           type: object
     *                           properties:
     *                             connectionModules:
     *                               type: array
     *                               items:
     *                                 type: object
     *                                 properties:
     *                                   imei:
     *                                     type: string
     *                                   state:
     *                                     type: object
     *                                     properties:
     *                                       state:
     *                                         type: string
     *                                       originatedAt:
     *                                         type: string
     *                                         format: date-time
     *                                       updatedAt:
     *                                         type: string
     *                                         format: date-time
     *                                       createdAt:
     *                                         type: string
     *                                         format: date-time
     *                                   detectedProtocolVersion:
     *                                     $ref: "#/components/schemas/StateObject"
     *                                   setProtocolVersion:
     *                                     $ref: "#/components/schemas/StateObject"
     *                                   detectedProtocol:
     *                                     $ref: "#/components/schemas/StateObject"
     *                                   setProtocol:
     *                                     $ref: "#/components/schemas/StateObject"
     *                         position:
     *                           type: object
     *                           properties:
     *                             latitude:
     *                               $ref: "#/components/schemas/StateObject"
     *                             longitude:
     *                               $ref: "#/components/schemas/StateObject"
     *                             accuracy:
     *                               $ref: "#/components/schemas/StateObject"
     *                             createdAt:
     *                               type: string
     *                               format: date-time
     *                     lock:
     *                       type: object
     *                       properties:
     *                         state:
     *                           $ref: "#/components/schemas/StateObject"
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *       400:
     *         description: Missing imei
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Missing imei
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
    router.get(this._path, async (req: Request, res: Response) => {
      await this.run(req, res);
    });
  }

  private async run(req: Request, res: Response): Promise<void> {
    const imei = req.params.imei;

    if (!imei) {
      res.status(400).json({ message: "Missing imei" });
    }

    const vehicle = await this._vehicleRepository.findByImeiStorageObject(imei);

    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }

    res.status(200).json(vehicle.value);
  }
}
