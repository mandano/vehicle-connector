import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { CreateUpdateSimpleScooter } from "../CreateUpdateSimpleScooter.ts";
import { ID_0_1 } from "../../../../../../src/versions.ts";
import { THE_SIMPLE_PROTOCOL_ABBREVIATION } from "../../../../../../src/Protocol.ts";
import BuildMessageLine from "../../../../../../src/simulator/0_1/pakets/simpleUpdate/toConnector/CreateMessageLine.ts";
import {
  SimpleUpdate
} from "../../../../../../src/connector/0_1/pakets/simpleUpdate/SimpleUpdate.ts";

describe("BuildMessageLine", () => {
  let buildMessageLine: BuildMessageLine;

  beforeEach(() => {
    buildMessageLine = new BuildMessageLine();
  });

  it("should build a message line with update state", () => {
    const imei = "123456789";
    const updateSimpleScooter = new CreateUpdateSimpleScooter().run({trackingId: 'asdf'});

    const result = buildMessageLine.run(updateSimpleScooter, imei);

    assert.match(
      result,
      new RegExp(
        `${THE_SIMPLE_PROTOCOL_ABBREVIATION};${ID_0_1};${imei};${SimpleUpdate.messageLineKey};\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z;lat=${updateSimpleScooter.latitude},latOriginatedAt=${updateSimpleScooter.latitudeOriginatedAt.toISOString()},lng=${updateSimpleScooter.longitude},lngOriginatedAt=${updateSimpleScooter.longitudeOriginatedAt.toISOString()},${updateSimpleScooter.trackingId}`,
      ),
    );
  });

  it("should build a message line with update state", () => {
    const imei = "123456789";
    const updateSimpleScooter = new CreateUpdateSimpleScooter().run();

    const result = buildMessageLine.run(updateSimpleScooter, imei);

    assert.match(
      result,
      new RegExp(
        `${THE_SIMPLE_PROTOCOL_ABBREVIATION};${ID_0_1};${imei};${SimpleUpdate.messageLineKey};\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z;lat=${updateSimpleScooter.latitude},latOriginatedAt=${updateSimpleScooter.latitudeOriginatedAt.toISOString()},lng=${updateSimpleScooter.longitude},lngOriginatedAt=${updateSimpleScooter.longitudeOriginatedAt.toISOString()}`,
      ),
    );
  });
});
