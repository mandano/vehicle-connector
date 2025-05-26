import { Vehicle } from "../../../connector/common/src/vehicle/Vehicle.ts";
import { TcpClient } from "../adapters/TcpClient.ts";
import { OnData } from "../adapters/tcpClient/onData/OnData.ts";
import { OnLockRequest } from "../adapters/tcpClient/onData/OnLockRequest.ts";
import { LoggerInterface } from "../../../connector/common/src/logger/LoggerInterface.ts";
import { WorkerQueue } from "../../../connector/common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { Imei } from "../../../connector/common/src/vehicle/components/iot/network/protocol/Imei.ts";
import HttpClient from "../adapters/httpClient/HttpClient.ts";
import { Channel } from "../../../connector/common/src/adapters/queue/rabbitMq/Channel.ts";
import { UserApiActions } from "../adapters/connector/UserApiActions.ts";
import { HashColoredLogger } from "../../../connector/common/src/logger/HashColoredLogger.ts";
import { CreateByProtocolAndVersionInterface } from "../../../modules/protocols/common/src/simulator/fromConnector/messageLineContext/CreateByProtocolAndVersionInterface.ts";
import CreateMessageLinesInterface from "../../../modules/protocols/common/src/simulator/toConnector/update/CreateMessageLinesInterface.ts";
import CreateMessageLineInterface from "../../../modules/protocols/common/src/simulator/pakets/lock/CreateMessageLineInterface.ts";
import CreateActionInterface from "../../../modules/protocols/common/src/simulator/toConnector/update/action/CreateActionInterface.ts";
import CreateLockableScooter from "../../../connector/common/src/vehicle/model/builders/create/lockableScooter/CreateLockableScooter.ts";

import { SendUpdate } from "./sendToConnector/update/SendUpdate.ts";
import { SimulatedVehicle } from "./SimulatedVehicle.ts";
import { SendToServer } from "./sendToConnector/SendToServer.ts";
import { TriggerAdHocUpdate } from "./adHocUpdate/TriggerAdHocUpdate.ts";
import { VehicleUserApiActions } from "./VehicleUserApiActions.ts";
import { GetRandomCoordinateForLocation } from "./position/GetRandomCoordinateForLocation.ts";
import { AdHocUpdateJsonConverter } from "./adHocUpdate/AdHocUpdateJsonConverter.ts";
import { ReactToAction } from "./actions/ReactToAction.ts";
import { AdHocPublisher } from "./adHocUpdate/AdHocPublisher.ts";
import { SendLock } from "./adHocUpdate/SendLock.ts";
import { ProtocolConfigs } from "./ProtocolConfigs.ts";
import { PickRandomLocation } from "./position/PickRandomLocation.ts";

export class SetupSimulatedVehicles {
  private readonly _imeis: Imei[] = [];
  private readonly _logger: LoggerInterface;
  private readonly _hashColoredLogger: HashColoredLogger;
  private readonly _channel: Channel;

  constructor(
    logger: LoggerInterface,
    imeis: Imei[],
    rabbitMq: Channel,
    hashColoredLogger: HashColoredLogger,
    private _protocolConfigs: ProtocolConfigs,
    private readonly _createLockableScooter: CreateLockableScooter,
    private readonly _pickRandomLocation: PickRandomLocation,
    private readonly _getRandomCoordinateForLocation: GetRandomCoordinateForLocation,
    private readonly _createMessageLineContextByProtocolAndVersion: CreateByProtocolAndVersionInterface,
    private readonly _createMessageLines: CreateMessageLinesInterface,
    private readonly _lockToMessageLine: CreateMessageLineInterface,
    private readonly _createAction: CreateActionInterface,
  ) {
    this._logger = logger;
    this._imeis = imeis;
    this._channel = rabbitMq;
    this._hashColoredLogger = hashColoredLogger;
  }

  public async run(): Promise<SimulatedVehicle[]> {
    const simulatedVehicles: SimulatedVehicle[] = [];

    let i = 0;

    for (const imei of this._imeis) {
      const host = "localhost";
      const port = 1234;
      const location = this._pickRandomLocation.run();
      const randomCoordinate =
        await this._getRandomCoordinateForLocation.run(location);

      if (!randomCoordinate) {
        throw new Error("Could not get random coordinate");
      }

      const protocolConfig = this._protocolConfigs[imei];

      const lockableScooter = this._createLockableScooter.run({
        imei: imei,
        protocol: protocolConfig.protocol,
        protocolVersion: protocolConfig.protocolVersion,
        coordinate: {
          latitude: randomCoordinate.latitude,
          longitude: randomCoordinate.longitude,
        },
        initWithDefaultValues: true
      });

      const adHocUpdates = new WorkerQueue(this._channel, "adHocUpdate");
      const triggerAdHocUpdate = new TriggerAdHocUpdate(
        adHocUpdates,
        new AdHocUpdateJsonConverter(this._logger),
      );

      const onData = new OnData(
        this._hashColoredLogger,
        this._createAction,
        new ReactToAction(
          new OnLockRequest(this._logger, 0.1),
          triggerAdHocUpdate,
        ),
        this._createMessageLineContextByProtocolAndVersion,
      );

      const vehicle = new Vehicle(i, lockableScooter, new Date());
      const tcpClient = new TcpClient(
        host,
        port,
        vehicle,
        onData,
        this._logger,
      );

      const sendToServer = new SendToServer(
        tcpClient,
        this._hashColoredLogger,
        this._logger,
      );

      const sendUpdate = new SendUpdate(sendToServer, this._createMessageLines);

      const vehicleUserApiActions = new VehicleUserApiActions(
        new UserApiActions(
          new HttpClient("http://localhost:3000", this._logger),
          this._hashColoredLogger,
        ),
        imei,
        this._logger,
      );

      const simulatedVehicle = new SimulatedVehicle(
        vehicle,
        location,
        sendUpdate,
        vehicleUserApiActions,
        this._logger,
        new AdHocPublisher(new SendLock(sendToServer, this._lockToMessageLine)),
      );

      simulatedVehicles.push(simulatedVehicle);
      i = i + 1;
    }

    return simulatedVehicles;
  }
}
