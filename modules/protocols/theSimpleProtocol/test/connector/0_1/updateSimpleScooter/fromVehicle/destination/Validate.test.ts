import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { Validate } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/Validate.ts";
import { ValidationRules } from "../../../../../../src/connector/0_1/pakets/simpleUpdate/fromVehicle/ValidationRules.ts";
import { ValidationOrder } from "../../../../../../src/connector/0_1/pakets/simpleUpdate/fromVehicle/ValidationOrder.ts";
import { FakeLogger } from "../../../../../../../../../connector/common/test/logger/FakeLogger.ts";

describe("Validate", () => {
  it("should build a message line with state", () => {
    const validate = new Validate(
      new ValidationRules(),
      new ValidationOrder(),
      new FakeLogger(),
    );

    const result = validate.run([
      "T_S_P",
      "0_1",
      "123456789123456",
      "UPDATE_SIMPLE_SCOOTER",
      "2021-01-01T00:00:00.000Z",
      "12.4567",
      "2021-01-01T00:00:00.000Z",
      "12.4567",
      "2021-01-01T00:00:00.000Z",
    ]);

    assert.strictEqual(result, true);
  });
});
