import { Request, Response, Router as ExpressRouter } from "express";

import { RouteInterface } from "../../RouteInterface.ts";
import VehicleRepositoryInterface from "../../../../../common/src/repositories/VehicleRepositoryInterface.ts";

export class Get implements RouteInterface {
  private _path: string = "/vehicle/:id([0-9]{1,6})";
  private _vehicleRepository: VehicleRepositoryInterface;

  constructor(vehicleRepository: VehicleRepositoryInterface) {
    this._vehicleRepository = vehicleRepository;
  }

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
     *
     * /api/v1/vehicle/{id}:
     *   get:
     *     tags:
     *       - Vehicle
     *     summary: Returns vehicle information for a certain vehicle
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the vehicle
     *     responses:
     *       200:
     *         description: All info about the vehicle
     *         content:
     *           application/json:
     *             schema:
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
     */
    router.get(this._path, (req: Request, res: Response) => {
      this.run(req, res);
    });
  }

  private run(req: Request, res: Response): void {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ message: "Missing vehicle id" });
    }

    const vehicleId = parseInt(id);

    const vehicle = this._vehicleRepository.findByIdJson(vehicleId);

    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }

    res.status(200).json(vehicle);
  }
}
