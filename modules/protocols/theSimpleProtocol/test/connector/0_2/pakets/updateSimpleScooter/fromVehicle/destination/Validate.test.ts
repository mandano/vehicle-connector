import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { Validate } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/Validate.ts";
import { ValidationRules } from "../../../../../../../src/connector/0_2/pakets/simpleUpdate/fromVehicle/ValidationRules.ts";
import { ValidationOrder } from "../../../../../../../src/connector/0_2/pakets/simpleUpdate/fromVehicle/ValidationOrder.ts";
import { FakeLogger } from "../../../../../../../../../../connector/common/test/logger/FakeLogger.ts";

describe("Validate", () => {
  it("should build a message line with state", () => {
    const validate = new Validate(
      new ValidationRules(),
      new ValidationOrder(),
      new FakeLogger(),
    );

    const result = validate.run([
      "T_S_P",
      "0_2",
      "178083319377612",
      "UPDATE_SIMPLE_SCOOTER",
      "2025-03-26T16:16:56.839Z",
      "-1.3393",
      "2025-03-26T16:16:56.839Z",
      "-15.8821",
      "2025-03-26T16:16:56.839Z",
      "6112559627482277",
      "2025-03-26T16:16:56.839Z",
      "12",
      "2025-03-26T16:16:56.839Z",
      "123.45",
      "2025-03-26T16:16:56.839Z",
      "324236"
    ]);

    assert.strictEqual(result, true);
  });
});
