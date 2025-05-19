import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { ID_0_2 } from "../../../../../../src/versions.ts";
import { CreateSimpleUpdate } from "../../../../../../src/connector/0_2/pakets/simpleUpdate/CreateSimpleUpdate.ts";
import { SimpleUpdate } from "../../../../../../src/connector/0_2/pakets/simpleUpdate/SimpleUpdate.ts";
import { Context as TheSimpleProtocolContext } from "../../../../../../src/_Context.ts";
import { FakeLogger } from "../../../../../../../../../connector/common/test/logger/FakeLogger.ts";

describe("CreateUpdateSimpleScooter", () => {
  let createUpdateSimpleScooter: CreateSimpleUpdate;
  const logger = new FakeLogger();
  const theSimpleProtocolContext = new TheSimpleProtocolContext(logger);

  beforeEach(() => {
    createUpdateSimpleScooter =
      theSimpleProtocolContext.connector.v0_2.pakets.simpleUpdate
        .createUpdateSimpleScooter;
  });

  it("should return undefined if imei is undefined", () => {
    const result = createUpdateSimpleScooter.run({});
    assert.strictEqual(result, undefined);
  });

  it("should create and return an instance of UpdateSimpleScooter if imei is defined", () => {
    const input = {
      imei: "123456789",
      latitude: 51.509865,
      originatedAt: new Date(),
      latitudeOriginatedAt: new Date("2023-11-01T10:00:00Z"),
      longitude: -0.118092,
      longitudeOriginatedAt: new Date("2023-11-01T10:05:00Z"),
      mileage: 120,
      mileageOriginatedAt: new Date("2023-11-01T10:10:00Z"),
      energy: 80,
      energyOriginatedAt: new Date("2023-11-01T10:15:00Z"),
      speed: 25,
      speedOriginatedAt: new Date("2023-11-01T10:20:00Z"),
    };

    const result = createUpdateSimpleScooter.run(input);

    assert(result instanceof SimpleUpdate);
    assert.deepStrictEqual(
      result,
      new SimpleUpdate(
        input.imei,
        ID_0_2,
        input.originatedAt,
        input.latitude,
        input.latitudeOriginatedAt,
        input.longitude,
        input.longitudeOriginatedAt,
        input.mileage,
        input.mileageOriginatedAt,
        input.energy,
        input.energyOriginatedAt,
        input.speed,
        input.speedOriginatedAt,
      ),
    );
  });

  it("should create UpdateSimpleScooter with only imei and default undefined values for the rest", () => {
    const input = {
      imei: "987654321",
      originatedAt: new Date(),
    };

    const result = createUpdateSimpleScooter.run(input);

    assert(result instanceof SimpleUpdate);
    assert.deepStrictEqual(
      result,
      new SimpleUpdate(
        input.imei,
        ID_0_2,
        input.originatedAt,
        undefined, // Latitude
        undefined, // Latitude originated at
        undefined, // Longitude
        undefined, // Longitude originated at
        undefined, // Mileage
        undefined,
        undefined, // Energy
        undefined,
        undefined, // Speed
        undefined,
      ),
    );
  });

  it("should create UpdateSimpleScooter with only imei and default undefined values when params not provided", () => {
    const input = {
      imei: "987654321",
      originatedAt: new Date(),
    };

    const result = createUpdateSimpleScooter.run(input);

    assert(result instanceof SimpleUpdate);
    assert.deepStrictEqual(
      result,
      new SimpleUpdate(input.imei, ID_0_2, input.originatedAt),
    );
  });
});
