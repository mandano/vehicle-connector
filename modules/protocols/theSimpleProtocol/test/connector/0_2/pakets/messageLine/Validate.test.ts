import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { Validate } from "../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/Validate.ts";
import { ValidationRules } from "../../../../../src/connector/0_2/pakets/simpleUpdate/fromVehicle/ValidationRules.ts";
import { ValidationOrder } from "../../../../../src/connector/0_2/pakets/simpleUpdate/fromVehicle/ValidationOrder.ts";
import { FakeLogger } from "../../../../../../../../connector/common/test/logger/FakeLogger.ts";
import { MessageLineSplitter } from "../../../../../src/connector/0_2/pakets/simpleUpdate/fromVehicle/MessageLineSplitter.ts";

describe("Validate", () => {
  it("should build a message line with state", () => {
    const validate = new Validate(
      new ValidationRules(),
      new ValidationOrder(),
      new FakeLogger(),
    );

    const items = new MessageLineSplitter().run(
      "T_S_P;0_2;359876054321098;UPDATE_SIMPLE_SCOOTER;2025-03-30T11:24:59.289Z;lat=52.528026,latOriginatedAt=2025-03-30T11:24:59.289Z,lng=13.4731068,lngOriginatedAt=2025-03-30T11:24:59.289Z,mileage=0,mileageOriginatedAt=2025-03-30T11:24:59.289Z,energy=100,energyOriginatedAt=2025-03-30T11:24:59.289Z,speed=0,speedOriginatedAt=2025-03-30T11:24:59.289Z,trackingId=undefined",
    );

    if (items === undefined) {
      assert.fail("Message line splitter returned undefined");
    }

    const result = validate.run(items);

    assert.strictEqual(result, true);
  });
});
