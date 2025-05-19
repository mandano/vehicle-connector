import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { CreateSimpleUpdate } from "../../../../../../src/connector/0_1/pakets/simpleUpdate/fromVehicle/CreateSimpleUpdate.ts";
import { Validate } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/Validate.ts";
import { ValidationRules } from "../../../../../../src/connector/0_1/pakets/simpleUpdate/fromVehicle/ValidationRules.ts";
import { ValidationOrder } from "../../../../../../src/connector/0_1/pakets/simpleUpdate/fromVehicle/ValidationOrder.ts";
import { FakeLogger } from "../../../../../../../../../connector/common/test/logger/FakeLogger.ts";
import { MessageLineSplitter } from "../../../../../../src/connector/0_1/pakets/simpleUpdate/fromVehicle/MessageLineSplitter.ts";
import { SimpleUpdate } from "../../../../../../src/connector/0_1/pakets/simpleUpdate/SimpleUpdate.ts";

describe("BuildFromMessageLine", () => {
  let buildFromMessageLine: CreateSimpleUpdate;

  beforeEach(() => {
    const validate = new Validate(
      new ValidationRules(),
      new ValidationOrder(),
      new FakeLogger(),
    );
    const messageSplitter = new MessageLineSplitter();

    buildFromMessageLine = new CreateSimpleUpdate(validate, messageSplitter);
  });

  it("should return undefined when message line splitter returns undefined", () => {
    const result = buildFromMessageLine.run("some message");

    assert.strictEqual(result, undefined);
  });

  it("should create UpdateSimpleScooter when validation passes", () => {
    const result = buildFromMessageLine.run(
      "T_S_P;0_1;123456789123456;UPDATE_SIMPLE_SCOOTER;2021-01-01T00:00:00.000Z;lat=12.456,lat_timestamp=2021-01-01T00:00:00.000Z,lng=12.567,lng_timestamp=2021-01-01T00:00:00.000Z",
    );

    assert.ok(result instanceof SimpleUpdate);
    assert.strictEqual(result?.latitude, 12.456);
    assert.strictEqual(result?.longitude, 12.567);
    assert.deepStrictEqual(
      result?.latitudeOriginatedAt,
      new Date("2021-01-01T00:00:00.000Z"),
    );
    assert.deepStrictEqual(
      result?.longitudeOriginatedAt,
      new Date("2021-01-01T00:00:00.000Z"),
    );
    assert.deepStrictEqual(
      result?.originatedAt,
      new Date("2021-01-01T00:00:00.000Z"),
    );
  });
});
