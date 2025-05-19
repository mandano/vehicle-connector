import { describe, it, beforeEach, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

import { faker } from "@faker-js/faker";

import VehicleFileSystemRepository from "../../src/repositories/VehicleFileSystemRepository.ts";
import { FakeFileSystemAdapter } from "../adapters/FakeFileSystemAdapter.ts";
import { Unknown } from "../../src/vehicle/model/models/Unknown.ts";
import { Network } from "../../src/vehicle/components/iot/network/Network.ts";
import { JsonVehicle } from "../../src/vehicle/json/JsonVehicle.ts";
import { ConnectionModule } from "../../src/vehicle/components/iot/network/ConnectionModule.ts";
import { State } from "../../src/vehicle/State.ts";
import { VehicleToJsonVehicle } from "../../src/vehicle/json/vehicleToJsonVehicle/VehicleToJsonVehicle.ts";
import { Unknown as VehicleToJsonVehicleUnknown } from "../../src/vehicle/json/vehicleToJsonVehicle/models/Unknown.ts";
import { LockableScooter as VehicleToJsonVehicleLockableScooter } from "../../src/vehicle/json/vehicleToJsonVehicle/models/LockableScooter.ts";
import { JsonVehicleToVehicle } from "../../src/vehicle/json/jsonVehicleToVehicle/JsonVehicleToVehicle.ts";
import { SetConnectionModules } from "../../src/vehicle/json/jsonVehicleToVehicle/SetConnectionModules.ts";
import { SetState } from "../../src/vehicle/json/jsonVehicleToVehicle/SetState.ts";
import { Unknown as JsonVehicleToVehicleUnknown } from "../../src/vehicle/json/jsonVehicleToVehicle/models/Unknown.ts";
import { LockableScooter as JsonVehicleToVehicleLockableScooter } from "../../src/vehicle/json/jsonVehicleToVehicle/models/LockableScooter.ts";
import { NetworkBuilder } from "../../src/vehicle/json/vehicleToJsonVehicle/models/unknown/NetworkBuilder.ts";
import { PositionBuilder } from "../../src/vehicle/json/vehicleToJsonVehicle/models/unknown/PositionBuilder.ts";
import { EnergyBuilder } from "../../src/vehicle/json/vehicleToJsonVehicle/models/unknown/EnergyBuilder.ts";
import { SendActionRequest } from "../../src/vehicle/model/actions/SendActionRequest.ts";
import { WorkerQueue } from "../../src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { RabbitMqConnection } from "../../src/adapters/queue/rabbitMq/RabbitMqConnection.ts";
import { FakeLogger } from "../logger/FakeLogger.ts";
import { LoggerInterface } from "../../src/logger/LoggerInterface.ts";
import { Channel } from "../../src/adapters/queue/rabbitMq/Channel.ts";
import { IoT } from "../../src/vehicle/components/iot/IoT.ts";
import ContainsIot from "../../src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../src/vehicle/components/iot/network/ContainsNetwork.ts";

describe("VehicleFileSystemRepository", () => {
  let repository: VehicleFileSystemRepository;
  let fakeFileSystemAdapter: FakeFileSystemAdapter;
  const folderPath = `/tmp/test_vehicleFileSystemRepository_${faker.string.alphanumeric(8)}`;
  const fileName = "vehicles.json";
  const filePath = path.join(folderPath, fileName);
  let logger: LoggerInterface;

  before(() => {
    const dir = path.dirname(folderPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  after(() => {
    if (fs.existsSync(folderPath)) {
      fs.rmdirSync(folderPath);
    }
  });

  beforeEach(() => {
    logger = new FakeLogger();
    fakeFileSystemAdapter = new FakeFileSystemAdapter({});
    repository = new VehicleFileSystemRepository(
      filePath,
      fakeFileSystemAdapter,
      new VehicleToJsonVehicle(
        new VehicleToJsonVehicleUnknown(
          new NetworkBuilder(),
          new PositionBuilder(),
          new EnergyBuilder(),
        ),
        new VehicleToJsonVehicleLockableScooter(
          new NetworkBuilder(),
          new PositionBuilder(),
          new EnergyBuilder(),
        ),
      ),
      new JsonVehicleToVehicle(
        new JsonVehicleToVehicleLockableScooter(
          new SetConnectionModules(new SetState()),
          new SetState(),
          new SendActionRequest(
            new WorkerQueue(
              new Channel(new RabbitMqConnection("adsf", logger), logger),
              "asdf",
            ),
          ),
        ),
        new JsonVehicleToVehicleUnknown(
          new SetConnectionModules(new SetState()),
          new SetState(),
        ),
      ),
    );
  });

  it("should create a new vehicle", () => {
    const model = new Unknown();
    const newId = repository.create(model);
    assert.strictEqual(newId, 0);
    const data = fakeFileSystemAdapter.readData(filePath);
    assert.strictEqual(data.length, 1);
    assert.strictEqual((data[0] as JsonVehicle).id, 0);
  });

  it("should create a second vehicle", () => {
    const model = new Unknown();
    const newId = repository.create(model);
    assert.strictEqual(newId, 0);

    const secondModel = new Unknown();
    const secondModelNewId = repository.create(secondModel);
    assert.strictEqual(secondModelNewId, 1);

    const data = fakeFileSystemAdapter.readData(filePath);
    assert.strictEqual(data.length, 2);
    assert.strictEqual((data[1] as JsonVehicle).id, 1);
  });

  it("should find a vehicle by id", () => {
    const model = new Unknown();
    repository.create(model);
    const vehicle = repository.findById(0);
    assert.ok(vehicle);
    assert.strictEqual(vehicle.id, 0);
  });

  it("should return undefined for non-existing vehicle by id", () => {
    const vehicle = repository.findById(999);
    assert.strictEqual(vehicle, undefined);
  });

  it("should update a vehicle by IMEI", () => {
    const imei = faker.phone.imei();

    const model = new Unknown(
      undefined,
      new IoT(
        new Network([
          new ConnectionModule(imei, new State(ConnectionModule.CONNECTED)),
        ]),
      ),
    );
    repository.create(model);
    const updatedModel = new Unknown(
      undefined,
      new IoT(
        new Network([
          new ConnectionModule(imei, new State(ConnectionModule.DISCONNECTED)),
        ]),
      ),
    );
    const result = repository.updateByImei(imei, updatedModel);
    assert.notStrictEqual(result, false);
    const updatedVehicle = repository.findByImei(imei);
    assert.ok(updatedVehicle?.model instanceof Unknown);

    if (
      ContainsIot.run(updatedVehicle?.model) === false ||
      updatedVehicle.model.ioT === undefined
    ) {
      return;
    }

    if (
      ContainsNetwork.run(updatedVehicle?.model.ioT) === false ||
      updatedVehicle.model.ioT.network === undefined
    ) {
      return;
    }

    const connectionState =
      updatedVehicle.model.ioT.network.connectionModules[0].state?.state;

    assert.strictEqual(connectionState, ConnectionModule.DISCONNECTED);
  });

  it("should return false for updating non-existing vehicle by IMEI", () => {
    const imei = faker.phone.imei();
    const model = new Unknown();
    const result = repository.updateByImei(imei, model);
    assert.strictEqual(result, false);
  });

  it("should find a vehicle by IMEI", () => {
    const imei = faker.phone.imei();

    const model = new Unknown(
      undefined,
      new IoT(
        new Network([
          new ConnectionModule(imei, new State(ConnectionModule.CONNECTED)),
        ]),
      ),
    );
    repository.create(model);

    const vehicle = repository.findByImei(imei);

    if (
      ContainsIot.run(vehicle?.model) === false ||
      vehicle.model.ioT === undefined
    ) {
      return;
    }

    if (
      ContainsNetwork.run(vehicle?.model.ioT) === false ||
      vehicle.model.ioT.network === undefined
    ) {
      return;
    }

    assert.ok(vehicle);
    assert.strictEqual(vehicle?.model.ioT.network.connectionModules[0].imei, imei);
  });

  it("should return undefined for non-existing vehicle by IMEI", () => {
    const imei = faker.phone.imei();
    const vehicle = repository.findByImei(imei);
    assert.strictEqual(vehicle, undefined);
  });
});
