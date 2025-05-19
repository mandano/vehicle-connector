import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  MessageLineSplitter
} from "../../../../../../../src/connector/0_2/pakets/simpleUpdate/fromVehicle/MessageLineSplitter.ts";

describe("MessageLineSplitter", () => {
  let messageSplitter: MessageLineSplitter;

  beforeEach(() => {
    messageSplitter = new MessageLineSplitter();
  });

  it("should split a valid message line correctly", () => {
    const messageLine = "T_S_P;0_2;17-808331-937761-2;UPDATE_SIMPLE_SCOOTER;2025-03-26T16:16:56.839Z;lat=-1.3393,latOriginatedAt=2025-03-26T16:16:56.839Z,lng=-15.8821,lngOriginatedAt=2025-03-26T16:16:56.839Z,mileage=6112559627482277,mileageOriginatedAt=2025-03-26T16:16:56.839Z,energy=7009762207329423,energyOriginatedAt=2025-03-26T16:16:56.839Z,speed=6186214279081677,speedOriginatedAt=2025-03-26T16:16:56.839Z,trackingId=undefined";

    const expected = [
      "T_S_P",
      "0_2",
      "17-808331-937761-2",
      "UPDATE_SIMPLE_SCOOTER",
      "2025-03-26T16:16:56.839Z",
      "-1.3393",
      "2025-03-26T16:16:56.839Z",
      "-15.8821",
      "2025-03-26T16:16:56.839Z",
      "6112559627482277",
      "2025-03-26T16:16:56.839Z",
      "7009762207329423",
      "2025-03-26T16:16:56.839Z",
      "6186214279081677",
      "2025-03-26T16:16:56.839Z",
      "undefined"
    ];

    const result = messageSplitter.run(messageLine)

    assert.deepStrictEqual(result, expected);
  });

  it("should split a valid message line correctly with trackingId", () => {
    const messageLine = "T_S_P;0_2;17-808331-937761-2;UPDATE_SIMPLE_SCOOTER;2025-03-26T16:16:56.839Z;lat=-1.3393,latOriginatedAt=2025-03-26T16:16:56.839Z,lng=-15.8821,lngOriginatedAt=2025-03-26T16:16:56.839Z,mileage=6112559627482277,mileageOriginatedAt=2025-03-26T16:16:56.839Z,energy=7009762207329423,energyOriginatedAt=2025-03-26T16:16:56.839Z,speed=6186214279081677,speedOriginatedAt=2025-03-26T16:16:56.839Z,trackingId=1234";

    const expected = [
      "T_S_P",
      "0_2",
      "17-808331-937761-2",
      "UPDATE_SIMPLE_SCOOTER",
      "2025-03-26T16:16:56.839Z",
      "-1.3393",
      "2025-03-26T16:16:56.839Z",
      "-15.8821",
      "2025-03-26T16:16:56.839Z",
      "6112559627482277",
      "2025-03-26T16:16:56.839Z",
      "7009762207329423",
      "2025-03-26T16:16:56.839Z",
      "6186214279081677",
      "2025-03-26T16:16:56.839Z",
      "1234"
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
    const messageLine = "T_S_P;0_2; 17-808331-937761-2; UPDATE_SIMPLE_SCOOTER;2025-03-26T16:16:56.839Z;lat=-1.3393,latOriginatedAt=2025-03-26T16:16:56.839Z,lng=-15.8821,lngOriginatedAt=2025-03-26T16:16:56.839Z,mileage=6112559627482277,mileageOriginatedAt=2025-03-26T16:16:56.839Z,energy=7009762207329423,energyOriginatedAt=2025-03-26T16:16:56.839Z,speed=6186214279081677, speedOriginatedAt=2025-03-26T16:16:56.839Z,trackingId=1234";

    const expected = [
      "T_S_P",
      "0_2",
      "17-808331-937761-2",
      "UPDATE_SIMPLE_SCOOTER",
      "2025-03-26T16:16:56.839Z",
      "-1.3393",
      "2025-03-26T16:16:56.839Z",
      "-15.8821",
      "2025-03-26T16:16:56.839Z",
      "6112559627482277",
      "2025-03-26T16:16:56.839Z",
      "7009762207329423",
      "2025-03-26T16:16:56.839Z",
      "6186214279081677",
      "2025-03-26T16:16:56.839Z",
      "1234"
    ];

    assert.deepStrictEqual(messageSplitter.run(messageLine), expected);
  });
});