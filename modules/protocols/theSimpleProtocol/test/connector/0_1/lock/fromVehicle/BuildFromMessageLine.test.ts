import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { FakeLogger } from "../../../../../../../../connector/common/test/logger/FakeLogger.ts";
import { MessageLineSplitter } from "../../../../../src/connector/0_1/pakets/lock/fromVehicle/MessageLineSplitter.ts";
import { Validate } from "../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/Validate.ts";
import { CreateLock } from "../../../../../src/connector/0_1/pakets/lock/fromVehicle/CreateLock.ts";
import { ValidationRules } from "../../../../../src/connector/0_1/pakets/lock/fromVehicle/validation/ValidationRules.ts";
import { ValidationOrder } from "../../../../../src/connector/0_1/pakets/lock/fromVehicle/validation/ValidationOrder.ts";
import { Lock } from "../../../../../src/connector/0_1/pakets/lock/Lock.ts";

describe("BuildFromMessageLine", () => {
  let buildFromMessageLine: CreateLock;

  beforeEach(() => {
    const validate = new Validate(
      new ValidationRules(),
      new ValidationOrder(),
      new FakeLogger(),
    );
    const messageSplitter = new MessageLineSplitter();

    buildFromMessageLine = new CreateLock(validate, messageSplitter);
  });

  it("should return undefined when message line splitter returns undefined", () => {
    const result = buildFromMessageLine.run("invalid message");

    assert.strictEqual(result, undefined);
  });

  it("should return undefined when validation fails", () => {
    const result = buildFromMessageLine.run(
      "T_S_P;0_1;13456789;WRONG;2021-01-01T00:00:00.000Z;lock=unlocked,lockOriginatedAt=2021-01-01T00:00:00.000Z;123456",
    );

    assert.strictEqual(result, undefined);
  });

  it("should create Lock instance when validation passes", () => {
    const result = buildFromMessageLine.run(
      "T_S_P;0_1;123456789123456;LOCK;2021-01-01T00:00:00.000Z;lock=unlocked,lockOriginatedAt=2021-01-01T00:00:00.000Z;123456",
    );

    assert(result instanceof Lock);
    assert.strictEqual(result?.state.state, "unlocked");
    assert.deepStrictEqual(
      result?.state.originatedAt,
      new Date("2021-01-01T00:00:00.000Z"),
    );
    assert.strictEqual(result?.trackingId, "123456");
  });
});
