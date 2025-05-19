import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { UpdateEnergy } from "../../../../src/vehicles/update/energy/UpdateEnergy.ts";
import { SimulatedVehicle } from "../../../../src/vehicles/SimulatedVehicle.ts";
import { CreateUnknown } from "../../../../../connector/common/test/vehicle/model/models/create/CreateUnknown.ts";
import { CreateSimulatedVehicle } from "../../CreateSimulatedVehicle.ts";
import { FakeLogger } from "../../../../../connector/common/test/logger/FakeLogger.ts";
import { FakeHashColoredLogger } from "../../../../../connector/common/test/logger/FakeHashColoredLogger.ts";
import { HashColoredLoggerInterface } from "../../../../../connector/common/src/logger/HashColoredLoggerInterface.ts";
import { LoggerInterface } from "../../../../../connector/common/src/logger/LoggerInterface.ts";
import { Batteries } from "../../../../../connector/common/src/vehicle/components/energy/Batteries.ts";
import { Battery } from "../../../../../connector/common/src/vehicle/components/energy/Battery.ts";
import { State } from "../../../../../connector/common/src/vehicle/State.ts";
import { Model } from "../../../../../connector/common/src/vehicle/model/models/Model.ts";
import { Reservation } from "../../../../src/reservations/Reservation.ts";
import { Route } from "../../../../src/reservations/Route.ts";
import { Coordinate } from "../../../../src/vehicles/position/Coordinate.ts";

describe("UpdateEnergy", () => {
  let updateEnergy: UpdateEnergy;
  let simulatedVehicle: SimulatedVehicle;
  let logger: LoggerInterface;
  let hashColoredLogger: HashColoredLoggerInterface;

  beforeEach(() => {
    updateEnergy = new UpdateEnergy();
    logger = new FakeLogger();
    hashColoredLogger = new FakeHashColoredLogger();
  });

  it("should not update energy if vehicle model does not contain energy", () => {
    const unknown = new CreateUnknown().run({ batteries: undefined });

    simulatedVehicle = new CreateSimulatedVehicle(
      logger,
      hashColoredLogger,
    ).run({ model: unknown });
    const updated = updateEnergy.run(simulatedVehicle);
    assert.strictEqual(updated, false);
  });

  it("should not update energy if vehicle model batteries are undefined", () => {
    const unknown = new CreateUnknown().run({ batteries: new Batteries([]) });

    simulatedVehicle = new CreateSimulatedVehicle(
      logger,
      hashColoredLogger,
    ).run({ model: unknown });
    const updated = updateEnergy.run(simulatedVehicle);
    assert.strictEqual(updated, false);
  });

  it("mostRecentOriginatedAt not set", () => {
    const unknown = new CreateUnknown().run({
      batteries: new Batteries([new Battery(new State(0), new State(0))]),
    });

    simulatedVehicle = new CreateSimulatedVehicle(
      logger,
      hashColoredLogger,
    ).run({ model: unknown });
    const updated = updateEnergy.run(simulatedVehicle);
    assert.strictEqual(updated, false);
  });

  it("should update while no reservation", () => {
    const energyLevel = 20;
    const oneMinuteInPast = new Date(Date.now() - 60 * 1000);
    const unknown = new CreateUnknown().run({
      batteries: new Batteries([
        new Battery(new State(energyLevel, oneMinuteInPast)),
        new Battery(new State(energyLevel, oneMinuteInPast)),
      ]),
    });

    simulatedVehicle = new CreateSimulatedVehicle(
      logger,
      hashColoredLogger,
    ).run({ model: unknown });
    const updated = updateEnergy.run(simulatedVehicle);
    assert.strictEqual(updated, true);

    if (
      !Model.containsBatteries(simulatedVehicle.vehicle.model) ||
      simulatedVehicle.vehicle.model.batteries === undefined
    ) {
      throw new Error("Model does not contain batteries");
    }
    const newAvgEnergyLevel =
      simulatedVehicle.vehicle.model.batteries.getAvgLevel();
    assert.ok(newAvgEnergyLevel < energyLevel);
  });

  it("should update energy while in reservation", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000);
    const twelveMinIntervalInMilliSec = 12 * 60 * 1000;

    const energyLevel = 20;
    const unknown = new CreateUnknown().run({
      batteries: new Batteries([
        new Battery(new State(energyLevel, twoMinAgo)),
        new Battery(new State(energyLevel, twoMinAgo)),
      ]),
    });

    simulatedVehicle = new CreateSimulatedVehicle(
      logger,
      hashColoredLogger,
    ).run({ model: unknown });

    simulatedVehicle.reservation = new Reservation(
      1,
      fiveMinAgo,
      new Route(
        [new Coordinate(0, 0), new Coordinate(1, 1)],
        1234,
        twelveMinIntervalInMilliSec,
      ),
      logger,
    );
    const updated = updateEnergy.run(simulatedVehicle);
    assert.strictEqual(updated, true);

    if (
      !Model.containsBatteries(simulatedVehicle.vehicle.model) ||
      simulatedVehicle.vehicle.model.batteries === undefined
    ) {
      throw new Error("Model does not contain batteries");
    }
    const newAvgEnergyLevel =
      simulatedVehicle.vehicle.model.batteries.getAvgLevel();
    assert.ok(newAvgEnergyLevel < energyLevel);
  });

  it("should handle interval overlap with start reservation", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000);
    const twelveMinIntervalInMilliSec = 12 * 60 * 1000;

    const energyLevel = 20;
    const unknown = new CreateUnknown().run({
      batteries: new Batteries([
        new Battery(new State(energyLevel, fiveMinAgo)),
        new Battery(new State(energyLevel, fiveMinAgo)),
      ]),
    });

    simulatedVehicle = new CreateSimulatedVehicle(
      logger,
      hashColoredLogger,
    ).run({ model: unknown });

    simulatedVehicle.reservation = new Reservation(
      1,
      twoMinAgo,
      new Route(
        [new Coordinate(0, 0), new Coordinate(1, 1)],
        1234,
        twelveMinIntervalInMilliSec,
      ),
      logger,
    );
    const updated = updateEnergy.run(simulatedVehicle);
    assert.strictEqual(updated, true);

    if (
      !Model.containsBatteries(simulatedVehicle.vehicle.model) ||
      simulatedVehicle.vehicle.model.batteries === undefined
    ) {
      throw new Error("Model does not contain batteries");
    }
    const newAvgEnergyLevel =
      simulatedVehicle.vehicle.model.batteries.getAvgLevel();
    assert.ok(newAvgEnergyLevel < energyLevel);
  });

  it("should handle interval overlap with end reservation", () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const sevenMinIntervalInMilliSec = 7 * 60 * 1000;

    const energyLevel = 20;
    const unknown = new CreateUnknown().run({
      batteries: new Batteries([
        new Battery(new State(energyLevel, fiveMinAgo)),
        new Battery(new State(energyLevel, fiveMinAgo)),
      ]),
    });

    simulatedVehicle = new CreateSimulatedVehicle(
      logger,
      hashColoredLogger,
    ).run({ model: unknown });

    simulatedVehicle.reservation = new Reservation(
      1,
      tenMinAgo,
      new Route(
        [new Coordinate(0, 0), new Coordinate(1, 1)],
        1234,
        sevenMinIntervalInMilliSec,
      ),
      logger,
    );
    const updated = updateEnergy.run(simulatedVehicle);
    assert.strictEqual(updated, true);

    if (
      !Model.containsBatteries(simulatedVehicle.vehicle.model) ||
      simulatedVehicle.vehicle.model.batteries === undefined
    ) {
      throw new Error("Model does not contain batteries");
    }
    const newAvgEnergyLevel =
      simulatedVehicle.vehicle.model.batteries.getAvgLevel();
    assert.ok(newAvgEnergyLevel < energyLevel);
  });
});