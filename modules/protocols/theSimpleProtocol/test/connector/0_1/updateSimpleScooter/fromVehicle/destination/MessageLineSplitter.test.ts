import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  MessageLineSplitter
} from "../../../../../../src/connector/0_1/pakets/simpleUpdate/fromVehicle/MessageLineSplitter.ts";

describe("MessageLineSplitter", () => {
  let messageSplitter: MessageLineSplitter;

  beforeEach(() => {
    messageSplitter = new MessageLineSplitter();
  });

  it("should split a valid message line correctly", () => {
    const messageLine = "T_S_P;0_1;13456789;UPDATE_SIMPLE_SCOOTER;2021-01-01T00:00:00.000Z;lat=12.4567,lat_timestamp=2021-01-01T00:00:00.000Z,lng=12.4567,lng_timestamp=2021-01-01T00:00:00.000Z";

    const expected = [
      "T_S_P",
      "0_1",
      "13456789",
      "UPDATE_SIMPLE_SCOOTER",
      "2021-01-01T00:00:00.000Z",
      "12.4567",
      "2021-01-01T00:00:00.000Z",
      "12.4567",
      "2021-01-01T00:00:00.000Z"
    ];

    assert.deepStrictEqual(messageSplitter.run(messageLine), expected);
  });

  it("should split a valid message line correctly with trackingId", () => {
    const messageLine = "T_S_P;0_1;13456789;UPDATE_SIMPLE_SCOOTER;2021-01-01T00:00:00.000Z;lat=12.4567,lat_timestamp=2021-01-01T00:00:00.000Z,lng=12.4567,lng_timestamp=2021-01-01T00:00:00.000Z";

    const expected = [
      "T_S_P",
      "0_1",
      "13456789",
      "UPDATE_SIMPLE_SCOOTER",
      "2021-01-01T00:00:00.000Z",
      "12.4567",
      "2021-01-01T00:00:00.000Z",
      "12.4567",
      "2021-01-01T00:00:00.000Z"
    ];

    assert.deepStrictEqual(messageSplitter.run(messageLine), expected);
  });

  it("should return undefined when main items count is incorrect", () => {
    const messageLine = "T_S_P;0_1;13456789;UPDATE_SIMPLE_SCOOTER;2021-01-01T00:00:00.000Z";
    assert.strictEqual(messageSplitter.run(messageLine), undefined);
  });

  it("should return undefined when vehicle information count is incorrect", () => {
    const messageLine = "T_S_P;0_1;13456789;UPDATE_SIMPLE_SCOOTER;2021-01-01T00:00:00.000Z;lat=12.4567,lat_timestamp=2021-01-01T00:00:00.000Z";
    assert.strictEqual(messageSplitter.run(messageLine), undefined);
  });

  it("should return undefined when vehicle information format is invalid", () => {
    const messageLine = "T_S_P;0_1;13456789;UPDATE_SIMPLE_SCOOTER;2021-01-01T00:00:00.000Z;lat12.4567,lat_timestamp=2021-01-01T00:00:00.000Z,lng=12.4567,lng_timestamp=2021-01-01T00:00:00.000Z";
    assert.strictEqual(messageSplitter.run(messageLine), undefined);
  });

  it("should handle whitespace in the message line", () => {
    const messageLine = " T_S_P ; 0_1 ; 13456789 ; UPDATE_SIMPLE_SCOOTER ; 2021-01-01T00:00:00.000Z ; lat=12.4567 , lat_timestamp=2021-01-01T00:00:00.000Z , lng=12.4567 , lng_timestamp=2021-01-01T00:00:00.000Z ";

    const expected = [
      "T_S_P",
      "0_1",
      "13456789",
      "UPDATE_SIMPLE_SCOOTER",
      "2021-01-01T00:00:00.000Z",
      "12.4567",
      "2021-01-01T00:00:00.000Z",
      "12.4567",
      "2021-01-01T00:00:00.000Z"
    ];

    assert.deepStrictEqual(messageSplitter.run(messageLine), expected);
  });
});