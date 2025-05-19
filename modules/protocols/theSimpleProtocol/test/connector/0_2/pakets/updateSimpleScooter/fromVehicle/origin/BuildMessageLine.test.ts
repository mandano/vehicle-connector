import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { CreateMessageLine } from "../../../../../../../src/simulator/0_2/pakets/simpleUpdate/toConnector/CreateMessageLine.ts";
import {
  SimpleUpdate
} from "../../../../../../../src/connector/0_2/pakets/simpleUpdate/SimpleUpdate.ts";
import {CreateUpdateSimpleScooter} from "../CreateUpdateSimpleScooter.ts";
import {
  ID_0_2
} from "../../../../../../../src/versions.ts";
import {
  THE_SIMPLE_PROTOCOL_ABBREVIATION
} from "../../../../../../../src/Protocol.ts";

describe("BuildMessageLine", () => {
  let buildMessageLine: CreateMessageLine;

  beforeEach(() => {
    buildMessageLine = new CreateMessageLine();
  });

  it("messageLine matches", () => {
    const updateSimpleScooter = new CreateUpdateSimpleScooter().run();

    const result = buildMessageLine.run(updateSimpleScooter, updateSimpleScooter.imei);

    const expectedHeader = `${THE_SIMPLE_PROTOCOL_ABBREVIATION};${ID_0_2};${updateSimpleScooter.imei};${SimpleUpdate.messageLineKey};${updateSimpleScooter.originatedAt.toISOString()}`;
    const expectedData = [
      `lat=${updateSimpleScooter.latitude}`,
      `latOriginatedAt=${updateSimpleScooter.latitudeOriginatedAt?.toISOString()}`,
      `lng=${updateSimpleScooter.longitude}`,
      `lngOriginatedAt=${updateSimpleScooter.longitudeOriginatedAt?.toISOString()}`,
      `mileage=${updateSimpleScooter.mileage}`,
      `mileageOriginatedAt=${updateSimpleScooter.mileageOriginatedAt?.toISOString()}`,
      `energy=${updateSimpleScooter.energy}`,
      `energyOriginatedAt=${updateSimpleScooter.energyOriginatedAt?.toISOString()}`,
      `speed=${updateSimpleScooter.speed}`,
      `speedOriginatedAt=${updateSimpleScooter.speedOriginatedAt?.toISOString()}`,
      `trackingId=${updateSimpleScooter.trackingId}`
    ].join(",");

    const expectedMessageLine = `${expectedHeader};${expectedData}`;

    assert.strictEqual(expectedMessageLine, result);
  });

  it("undefined attributes are processed correctly", () => {
    const updateSimpleScooter = new CreateUpdateSimpleScooter().run({latitude: undefined, longitude: undefined})

    const result = buildMessageLine.run(updateSimpleScooter, updateSimpleScooter.imei);

    const expectedHeader = `${THE_SIMPLE_PROTOCOL_ABBREVIATION};${ID_0_2};${updateSimpleScooter.imei};${SimpleUpdate.messageLineKey};${updateSimpleScooter.originatedAt.toISOString()}`;
    const expectedData = [
      `lat=undefined`,
      `latOriginatedAt=${updateSimpleScooter.latitudeOriginatedAt?.toISOString()}`,
      `lng=undefined`,
      `lngOriginatedAt=${updateSimpleScooter.longitudeOriginatedAt?.toISOString()}`,
      `mileage=${updateSimpleScooter.mileage}`,
      `mileageOriginatedAt=${updateSimpleScooter.mileageOriginatedAt?.toISOString()}`,
      `energy=${updateSimpleScooter.energy}`,
      `energyOriginatedAt=${updateSimpleScooter.energyOriginatedAt?.toISOString()}`,
      `speed=${updateSimpleScooter.speed}`,
      `speedOriginatedAt=${updateSimpleScooter.speedOriginatedAt?.toISOString()}`,
      `trackingId=${updateSimpleScooter.trackingId}`
    ].join(",");

    const expectedMessageLine = `${expectedHeader};${expectedData}`;

    assert.strictEqual(expectedMessageLine, result);
  });
});