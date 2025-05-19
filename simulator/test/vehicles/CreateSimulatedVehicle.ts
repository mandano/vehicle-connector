import { faker } from "@faker-js/faker";

import { SimulatedVehicle } from "../../src/vehicles/SimulatedVehicle.ts";
import { Vehicle } from "../../../connector/common/src/vehicle/Vehicle.ts";
import { CreateUnknown } from "../../../connector/common/test/vehicle/model/models/create/CreateUnknown.ts";
import { Location } from "../../src/vehicles/position/Location.ts";
import { Coordinate } from "../../src/vehicles/position/Coordinate.ts";
import { SendUpdate } from "../../src/vehicles/sendToConnector/update/SendUpdate.ts";
import { TcpClient } from "../../src/adapters/TcpClient.ts";
import { SendToServer } from "../../src/vehicles/sendToConnector/SendToServer.ts";
import { VehicleUserApiActions } from "../../src/vehicles/VehicleUserApiActions.ts";
import { UserApiActions } from "../../src/adapters/connector/UserApiActions.ts";
import HttpClient from "../../src/adapters/httpClient/HttpClient.ts";
import { OnData } from "../../src/adapters/tcpClient/onData/OnData.ts";
import { OnLockRequest } from "../../src/adapters/tcpClient/onData/OnLockRequest.ts";
import { TriggerAdHocUpdate } from "../../src/vehicles/adHocUpdate/TriggerAdHocUpdate.ts";
import { AdHocUpdateJsonConverter } from "../../src/vehicles/adHocUpdate/AdHocUpdateJsonConverter.ts";
import { LoggerInterface } from "../../../connector/common/src/logger/LoggerInterface.ts";
import { HashColoredLoggerInterface } from "../../../connector/common/src/logger/HashColoredLoggerInterface.ts";
import { WorkerQueueFake } from "../../../connector/common/test/adapters/queue/rabbitMq/WorkerQueueFake.ts";
import { Unknown } from "../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { ReactToAction } from "../../src/vehicles/actions/ReactToAction.ts";
import { AdHocPublisher } from "../../src/vehicles/adHocUpdate/AdHocPublisher.ts";
import { SendLock } from "../../src/vehicles/adHocUpdate/SendLock.ts";
import ProtocolsCommonContext from "../../../modules/protocols/common/src/_Context.ts";
import TheSimpleProtocol from "../../../modules/protocols/theSimpleProtocol/src/_Context.ts";

export class CreateSimulatedVehicle {
  private readonly _logger: LoggerInterface;
  private readonly _hashColoredLogger: HashColoredLoggerInterface;

  constructor(
    logger: LoggerInterface,
    hashColoredLogger: HashColoredLoggerInterface,
  ) {
    this._logger = logger;
    this._hashColoredLogger = hashColoredLogger;
  }

  public run(options?: {
    vehicle?: Vehicle;
    model?: Unknown;
  }): SimulatedVehicle {
    const imei = faker.phone.imei();
    const vehicleId = 1;
    const host = "localhost";
    const port = 1234;
    const location = new Location("Berlin", new Coordinate(52.52, 13.405));
    const randomCoordinate = new Coordinate(
      faker.location.latitude(),
      faker.location.longitude(),
    );

    if (!randomCoordinate) {
      throw new Error("Could not get random coordinate");
    }

    const adHocUpdates = new WorkerQueueFake();
    const triggerAdHocUpdate = new TriggerAdHocUpdate(
      adHocUpdates,
      new AdHocUpdateJsonConverter(this._logger),
    );
    const protocolsContext = new ProtocolsCommonContext(
      new TheSimpleProtocol(this._logger),
    );

    const onData = new OnData(
      this._hashColoredLogger,
      protocolsContext.simulator.toConnector.update.action.createAction,
      new ReactToAction(
        new OnLockRequest(this._logger, 0.1),
        triggerAdHocUpdate,
      ),
      protocolsContext.simulator.fromConnector.messageLineContext.create,
    );
    const model = options?.model ?? new CreateUnknown().run();
    const vehicle =
      options?.vehicle ?? new Vehicle(vehicleId, model, new Date());
    const tcpClient = new TcpClient(host, port, vehicle, onData, this._logger);

    const sendToServer = new SendToServer(
      tcpClient,
      this._hashColoredLogger,
      this._logger,
    );

    const sendUpdate = new SendUpdate(
      sendToServer,
      protocolsContext.simulator.toConnector.update.createMessageLines,
    );

    const vehicleUserApiActions = new VehicleUserApiActions(
      new UserApiActions(
        new HttpClient("http://localhost:3000", this._logger),
        this._hashColoredLogger,
      ),
      imei,
      this._logger,
    );

    return new SimulatedVehicle(
      vehicle,
      location,
      sendUpdate,
      vehicleUserApiActions,
      this._logger,
      new AdHocPublisher(
        new SendLock(
          sendToServer,
          protocolsContext.simulator.pakets.lock.lockToMessageLine,
        ),
      ),
    );
  }
}
