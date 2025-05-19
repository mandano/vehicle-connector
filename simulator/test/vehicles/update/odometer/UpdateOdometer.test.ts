import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { SimulatedVehicle } from "../../../../src/vehicles/SimulatedVehicle.ts";
import { CreateUnknown } from "../../../../../connector/common/test/vehicle/model/models/create/CreateUnknown.ts";
import { CreateSimulatedVehicle } from "../../CreateSimulatedVehicle.ts";
import { FakeLogger } from "../../../../../connector/common/test/logger/FakeLogger.ts";
import { FakeHashColoredLogger } from "../../../../../connector/common/test/logger/FakeHashColoredLogger.ts";
import { HashColoredLoggerInterface } from "../../../../../connector/common/src/logger/HashColoredLoggerInterface.ts";
import { LoggerInterface } from "../../../../../connector/common/src/logger/LoggerInterface.ts";
import { State } from "../../../../../connector/common/src/vehicle/State.ts";
import { Reservation } from "../../../../src/reservations/Reservation.ts";
import { Route } from "../../../../src/reservations/Route.ts";
import { Coordinate } from "../../../../src/vehicles/position/Coordinate.ts";
import { UpdateOdometer } from "../../../../src/vehicles/update/odometer/UpdateOdometer.ts";
import { Odometer } from "../../../../../connector/common/src/vehicle/components/odometer/Odometer.ts";
import ContainsOdometer from "../../../../../connector/common/src/vehicle/components/odometer/ContainsOdometer.ts";

describe("UpdateOdometer", () => {
  let updateOdometer: UpdateOdometer;
  let simulatedVehicle: SimulatedVehicle;
  let logger: LoggerInterface;
  let hashColoredLogger: HashColoredLoggerInterface;

  beforeEach(() => {
    updateOdometer = new UpdateOdometer();
    logger = new FakeLogger();
    hashColoredLogger = new FakeHashColoredLogger();
  });

  it("should not update odometer if vehicle model does not contain odometer", () => {
    const unknown = new CreateUnknown().run({ odometer: undefined });

    simulatedVehicle = new CreateSimulatedVehicle(
      logger,
      hashColoredLogger,
    ).run({ model: unknown });
    const updated = updateOdometer.run(simulatedVehicle);
    assert.equal(updated, false);
  });

  it("mostRecentOriginatedAt not set", () => {
    const unknown = new CreateUnknown().run({
      odometer: new Odometer(new State(0)),
    });

    simulatedVehicle = new CreateSimulatedVehicle(
      logger,
      hashColoredLogger,
    ).run({ model: unknown });
    const updated = updateOdometer.run(simulatedVehicle);
    assert.equal(updated, false);
  });

  it("should update while no reservation", () => {
    const mileage = 20;
    const originatedAt = new Date();
    const unknown = new CreateUnknown().run({
      odometer: new Odometer(new State(mileage, originatedAt)),
    });

    simulatedVehicle = new CreateSimulatedVehicle(
      logger,
      hashColoredLogger,
    ).run({ model: unknown });

    const updated = updateOdometer.run(simulatedVehicle);
    assert.equal(updated, true);

    if (
      !ContainsOdometer.run(simulatedVehicle.vehicle.model) ||
      simulatedVehicle.vehicle.model.odometer === undefined
    ) {
      throw new Error("Model does not contain odometer");
    }

    assert.equal(
      simulatedVehicle.vehicle.model.odometer.state.state,
      mileage
    );
    assert.ok(simulatedVehicle.vehicle.model.odometer.state.originatedAt);
    assert.ok(
      simulatedVehicle.vehicle.model.odometer.state.originatedAt?.getTime() >= originatedAt.getTime()
    );
  });

  it("should update odometer while in reservation", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000);
    const twelveMinIntervalInMilliSec = 12 * 60 * 1000;

    const mileage = 20;
    const unknown = new CreateUnknown().run({
      odometer: new Odometer(new State(mileage, twoMinAgo)),
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
    const updated = updateOdometer.run(simulatedVehicle);
    assert.equal(updated, true);

    if (
      !ContainsOdometer.run(simulatedVehicle.vehicle.model) ||
      simulatedVehicle.vehicle.model.odometer === undefined
    ) {
      throw new Error("Model does not contain batteries");
    }

    assert.ok(
      simulatedVehicle.vehicle.model.odometer.state.state > mileage
    );
    assert.ok(simulatedVehicle.vehicle.model.odometer.state.originatedAt);
    assert.ok(
      simulatedVehicle.vehicle.model.odometer.state.originatedAt?.getTime() >= twoMinAgo.getTime()
    );
  });

  it("should handle interval overlap with start reservation", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000);
    const twelveMinIntervalInMilliSec = 12 * 60 * 1000;

    const mileage = 20;
    const unknown = new CreateUnknown().run({
      odometer: new Odometer(new State(mileage, fiveMinAgo)),
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
    const updated = updateOdometer.run(simulatedVehicle);
    assert.equal(updated, true);

    if (
      !ContainsOdometer.run(simulatedVehicle.vehicle.model) ||
      simulatedVehicle.vehicle.model.odometer === undefined
    ) {
      throw new Error("Model does not contain batteries");
    }

    assert.ok(
      simulatedVehicle.vehicle.model.odometer.state.state > mileage
    );
    assert.ok(simulatedVehicle.vehicle.model.odometer.state.originatedAt);
    assert.ok(
      simulatedVehicle.vehicle.model.odometer.state.originatedAt?.getTime() >= fiveMinAgo.getTime()
    );
  });

  it("should handle interval overlap with end reservation", () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const sevenMinIntervalInMilliSec = 7 * 60 * 1000;

    const mileage = 20;
    const unknown = new CreateUnknown().run({
      odometer: new Odometer(new State(mileage, fiveMinAgo)),
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
    const updated = updateOdometer.run(simulatedVehicle);
    assert.equal(updated, true);

    if (
      !ContainsOdometer.run(simulatedVehicle.vehicle.model) ||
      simulatedVehicle.vehicle.model.odometer === undefined
    ) {
      throw new Error("Model does not contain batteries");
    }

    assert.ok(
      simulatedVehicle.vehicle.model.odometer.state.state > mileage
    );
    assert.ok(simulatedVehicle.vehicle.model.odometer.state.originatedAt);
    assert.ok(
      simulatedVehicle.vehicle.model.odometer.state.originatedAt?.getTime() >= fiveMinAgo.getTime()
    );
  });
});