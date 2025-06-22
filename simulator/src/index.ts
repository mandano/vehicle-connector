import fs from "fs";

import dotenv from "dotenv";

import { Logger } from "../../connector/common/src/logger/Logger.ts";
import { LogLevels } from "../../connector/common/src/logger/LogLevels.ts";
import { WorkerQueue } from "../../connector/common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { RabbitMqConnection } from "../../connector/common/src/adapters/queue/rabbitMq/RabbitMqConnection.ts";
import { Channel } from "../../connector/common/src/adapters/queue/rabbitMq/Channel.ts";
import { HashColoredLogger } from "../../connector/common/src/logger/HashColoredLogger.ts";
import CreateLockableScooter from "../../connector/common/src/vehicle/model/builders/create/lockableScooter/CreateLockableScooter.ts";

import ManageReservations from "./reservations/manage/Manage.ts";
import { CreateReservation } from "./reservations/CreateReservation.ts";
import { GetRandomRadiusCoordinateTowardsTarget } from "./vehicles/position/GetRandomRadiusCoordinateTowardsTarget.ts";
import { DefaultScenario } from "./reservations/manage/DefaultScenario.ts";
import { Graphhopper } from "./adapters/Graphhopper.ts";
import { SetupSimulatedVehicles } from "./vehicles/SetupSimulatedVehicles.ts";
import { VehicleUpdatePublisher } from "./vehicles/services/VehicleUpdatePublisher.ts";
import { UpdatePosition } from "./vehicles/update/UpdatePosition.ts";
import { OnMessage } from "./vehicles/adHocUpdate/OnMessage.ts";
import { VehicleAdHocUpdatePublisher } from "./vehicles/services/VehicleAdHocUpdatePublisher.ts";
import { UpdateSpeedometer } from "./vehicles/update/UpdateSpeedometer.ts";
import { AdHocUpdateJsonConverter } from "./vehicles/adHocUpdate/AdHocUpdateJsonConverter.ts";
import { UpdateEnergy } from "./vehicles/update/energy/UpdateEnergy.ts";
import { UpdateOdometer } from "./vehicles/update/odometer/UpdateOdometer.ts";
import { ProtocolConfigs } from "./vehicles/ProtocolConfigs.ts";
import { PickRandomLocation } from "./vehicles/position/PickRandomLocation.ts";
import { Location } from "./vehicles/position/Location.ts";
import { Coordinate } from "./vehicles/position/Coordinate.ts";
import { GetRandomCoordinateForLocation } from "./vehicles/position/GetRandomCoordinateForLocation.ts";
import { OpenStreetMap } from "./adapters/OpenStreetMap.ts";
import loadContext from "./bootstrap/loadContext.ts";
import Add from "./reservations/manage/Add.ts";
import Remove from "./reservations/manage/Remove.ts";
import ChangeModelType from "./vehicles/ChangeModelType.ts";

async function run() {
  dotenv.config();

  const apiKey = process.env.GRAPHHOPPER_API_KEY;
  const recurrentVehicleUpdates = JSON.parse(
    process.env.RECURRENT_VEHICLE_UPDATES || "false",
  );

  if (apiKey === undefined) {
    throw new Error("API key not set");
  }

  const configPath = "./config.json";
  const rawData = fs.readFileSync(configPath, "utf-8");
  const config = JSON.parse(rawData);

  const imeis: string[] = config.imeis;

  const logger = new Logger(LogLevels.DEBUG_LEVEL);
  if (imeis.length === 0) {
    throw new Error("No imeis found in config");
  }

  logger.info(`Vehicle amount: ${imeis.length}`);

  const context = await loadContext();

  const protocolConfigs = config.protocolConfigs as ProtocolConfigs;
  const hashColoredLogger = new HashColoredLogger(LogLevels.DEBUG_LEVEL);
  const rabbitMq = new RabbitMqConnection(
    "amqp://user:password@localhost:5672",
    logger,
  );
  const rabbitMqChannel = new Channel(rabbitMq, logger);
  const vehicles = await new SetupSimulatedVehicles(
    logger,
    imeis,
    rabbitMqChannel,
    hashColoredLogger,
    protocolConfigs,
    new CreateLockableScooter(),
    new PickRandomLocation([
      new Location("Berlin", new Coordinate(52.52, 13.405)),
    ]),
    new GetRandomCoordinateForLocation(25000, new OpenStreetMap()),
    context.createMessageLineContextByProtocolAndVersion,
    context.createMessageLines,
    context.lockToMessageLine,
    context.createAction,
  ).run();
  const reservationsScenario = new DefaultScenario();

  const changeModelType = new ChangeModelType(logger);

  const manageReservations = new ManageReservations(
    vehicles,
    reservationsScenario,
    logger,
    new Add(
      logger,
      new CreateReservation(new Graphhopper(apiKey), logger),
      new GetRandomRadiusCoordinateTowardsTarget(
        reservationsScenario.getRandomKickScooterRentalMileage(),
        0.5,
      ),
      changeModelType
    ),
    new Remove(
      logger,
      changeModelType,
    ),
  );

  manageReservations.run().then((r) => console.log(r));

  const vehicleUpdatePublisher = new VehicleUpdatePublisher(
    vehicles,
    new UpdatePosition(),
    new UpdateSpeedometer(),
    new UpdateEnergy(),
    new UpdateOdometer(),
    recurrentVehicleUpdates === true ? 1 : undefined,
  );
  vehicleUpdatePublisher.run().then();

  const vehicleAdHocUpdatePublisher = new VehicleAdHocUpdatePublisher(
    new WorkerQueue(rabbitMqChannel, "adHocUpdate"),
    new OnMessage(vehicles, new AdHocUpdateJsonConverter(logger)),
  );
  vehicleAdHocUpdatePublisher.run().then();
}

run().then();
