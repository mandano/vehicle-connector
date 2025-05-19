import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { Unknown } from "../../../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { CreateSimpleUpdate } from "../../../../../../../src/connector/0_2/pakets/simpleUpdate/CreateSimpleUpdate.ts";
import { ID_0_2 } from "../../../../../../../src/versions.ts";
import { Director } from "../../../../../../../src/connector/0_2/pakets/simpleUpdate/models/unknown/Director.ts";
import { IotBuilder } from "../../../../../../../src/connector/0_2/pakets/simpleUpdate/models/unknown/IotBuilder.ts";
import { SpeedometerBuilder } from "../../../../../../../src/connector/0_2/pakets/simpleUpdate/models/unknown/SpeedometerBuilder.ts";
import { BatteriesBuilder } from "../../../../../../../src/connector/0_2/pakets/simpleUpdate/models/unknown/BatteriesBuilder.ts";
import { NetworkBuilder } from "../../../../../../../src/connector/0_2/pakets/simpleUpdate/models/unknown/NetworkBuilder.ts";
import { PositionBuilder } from "../../../../../../../src/connector/0_2/pakets/simpleUpdate/models/unknown/PositionBuilder.ts";
import { THE_SIMPLE_PROTOCOL } from "../../../../../../../src/Protocol.ts";

describe("Director", () => {
  let director: Director;
  let iotBuilder: IotBuilder;
  let speedometerBuilder: SpeedometerBuilder;
  let batteriesBuilder: BatteriesBuilder;
  let createUpdateSimpleScooter: CreateSimpleUpdate;

  beforeEach(() => {
    iotBuilder = new IotBuilder(new NetworkBuilder(), new PositionBuilder());
    speedometerBuilder = new SpeedometerBuilder();
    batteriesBuilder = new BatteriesBuilder();
    director = new Director(iotBuilder, speedometerBuilder, batteriesBuilder);
    createUpdateSimpleScooter = new CreateSimpleUpdate();
  });

  it("should build Unknown model with correct properties", () => {
    const imei = "359024681357924";
    const latitude = 52.4680898;
    const longitude = 13.2919201;
    const energy = 36102;
    const speed = 25;
    const mileage = 1000;
    const now = new Date();

    const updateSimpleScooter = createUpdateSimpleScooter.run({
      imei,
      latitude,
      longitude,
      energy,
      speed,
      mileage,
      latitudeOriginatedAt: now,
      longitudeOriginatedAt: now,
      energyOriginatedAt: now,
      speedOriginatedAt: now,
      mileageOriginatedAt: now,
    });

    if (updateSimpleScooter === undefined) {
      assert.fail("updateSimpleScooter should not be undefined");
      return;
    }

    const unknownModel = director.build(updateSimpleScooter);

    assert(unknownModel instanceof Unknown, "Should be an instance of Unknown");

    if (
      unknownModel.ioT === undefined ||
      unknownModel.ioT.network === undefined ||
      unknownModel.ioT.network.connectionModules[0] === undefined ||
      unknownModel.ioT.network.connectionModules[0].detectedProtocol ===
        undefined ||
      unknownModel.ioT.network.connectionModules[0].detectedProtocolVersion ===
        undefined ||
      unknownModel.ioT.position === undefined ||
      unknownModel.speedometer === undefined ||
      unknownModel.speedometer.state === undefined ||
      unknownModel.batteries === undefined
    ) {
      assert.fail("Required properties should not be undefined");
      return;
    }

    assert.strictEqual(
      unknownModel.ioT.network.connectionModules[0].imei,
      imei,
    );
    assert.strictEqual(
      unknownModel.ioT.network.connectionModules[0].detectedProtocol.state,
      THE_SIMPLE_PROTOCOL,
    );
    assert.strictEqual(
      unknownModel.ioT.network.connectionModules[0].detectedProtocolVersion
        .state,
      ID_0_2,
    );
    assert.strictEqual(unknownModel.ioT.position.latitude.state, latitude);
    assert.strictEqual(unknownModel.ioT.position.longitude.state, longitude);

    // Check batteries properties
    assert.strictEqual(unknownModel.batteries.batteries[0].level.state, energy);

    // Check speedometer properties
    assert.strictEqual(unknownModel.speedometer.state.state, speed);

    assert.deepStrictEqual(
      unknownModel.ioT.position.latitude.originatedAt,
      now,
    );
    assert.deepStrictEqual(
      unknownModel.ioT.position.longitude.originatedAt,
      now,
    );
    assert.deepStrictEqual(
      unknownModel.batteries.batteries[0].level.originatedAt,
      now,
    );
    assert.deepStrictEqual(unknownModel.speedometer.state.originatedAt, now);
  });

  it("should handle missing optional properties", () => {
    // Arrange
    const imei = "359024681357924";
    const latitude = 52.4680898;
    const longitude = 13.2919201;
    const updateSimpleScooter = createUpdateSimpleScooter.run({
      imei,
      latitude,
      longitude,
      // No energy, speed, mileage
    });

    if (updateSimpleScooter === undefined) {
      assert.fail("updateSimpleScooter should not be undefined");
      return;
    }

    const unknownModel = director.build(updateSimpleScooter);

    assert(unknownModel instanceof Unknown, "Should be an instance of Unknown");

    if (
      unknownModel.ioT === undefined ||
      unknownModel.ioT.network === undefined ||
      unknownModel.ioT.network.connectionModules[0] === undefined ||
      unknownModel.ioT.network.connectionModules[0].detectedProtocol ===
        undefined ||
      unknownModel.ioT.network.connectionModules[0].detectedProtocolVersion ===
        undefined
    ) {
      assert.fail("Required properties should not be undefined");
      return;
    }

    assert.strictEqual(
      unknownModel.ioT.network.connectionModules[0].imei,
      imei,
    );
    assert.strictEqual(
      unknownModel.ioT.network.connectionModules[0].detectedProtocol.state,
      THE_SIMPLE_PROTOCOL,
    );
    assert.strictEqual(
      unknownModel.ioT.network.connectionModules[0].detectedProtocolVersion
        .state,
      ID_0_2,
    );
  });
});
