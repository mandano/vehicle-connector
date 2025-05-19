import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { faker } from "@faker-js/faker";

import { Create } from "../../../../src/connector/fromVehicle/Create.ts";
import ContextTheSimpleProtocol from "../../../../../theSimpleProtocol/src/_Context.ts";
import { FakeLogger } from "../../../../../../../connector/common/test/logger/FakeLogger.ts";

describe("Create", () => {
  const logger = new FakeLogger();
  const contextTheSimpleProtocol = new ContextTheSimpleProtocol(logger);

  it("can create messageLineContext for T_S_P v0_1", () => {
    const create = new Create(
      contextTheSimpleProtocol.connector.common.fromVehicle.messageLineContext.create,
    );

    const imei = faker.string.numeric(15);
    const protocolVersion = "0_1";

    const messageLine = `T_S_P;${protocolVersion};${imei};UPDATE_SIMPLE_SCOOTER;2025-05-18T16:16:53.294Z;lat=52.5948795,latOriginatedAt=2025-05-18T16:16:53.294Z,lng=13.6932953,lngOriginatedAt=2025-05-18T16:16:53.294Z`;
    const messageLineContext = create.run(messageLine);

    if (messageLineContext === undefined) {
      assert.fail();
    }

    assert.ok(messageLineContext);
  });

  it("can create messageLineContext for T_S_P v0_2", () => {
    const create = new Create(
      contextTheSimpleProtocol.connector.common.fromVehicle.messageLineContext.create,
    );

    const imei = faker.string.numeric(15);
    const protocolVersion = "0_2";

    const messageLine = `T_S_P;${protocolVersion};${imei};UPDATE_SIMPLE_SCOOTER;2025-05-08T12:20:36.158Z;lat=52.596992,latOriginatedAt=2025-05-08T12:20:36.158Z,lng=13.386409,lngOriginatedAt=2025-05-08T12:20:36.158Z,mileage=226.61387377588647,mileageOriginatedAt=2025-05-08T12:20:36.158Z,energy=99,energyOriginatedAt=2025-05-08T12:20:36.158Z,speed=0.0000037230379472939224,speedOriginatedAt=2025-05-08T11:59:06.647Z,trackingId=undefined`;
    const messageLineContext = create.run(messageLine);

    if (messageLineContext === undefined) {
      assert.fail();
    }

    assert.ok(messageLineContext);
  });
});
