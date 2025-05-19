import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  MessageLineSplitter
} from "../../../../../src/connector/0_1/pakets/lock/fromVehicle/MessageLineSplitter.ts";

describe("MessageLineSplitter", () => {
  let messageSplitter: MessageLineSplitter;

  beforeEach(() => {
    messageSplitter = new MessageLineSplitter();
  });

  it("should split a valid message line correctly", () => {
    const messageLine = "T_S_P;0_1;13456789;LOCK;2021-01-01T00:00:00.000Z;lock=UNLOCKED,lockOriginatedAt=2021-01-01T00:00:00.000Z;123456";

    const expected = [
      "T_S_P",
      "0_1",
      "13456789",
      "LOCK",
      "2021-01-01T00:00:00.000Z",
      "UNLOCKED",
      "2021-01-01T00:00:00.000Z",
      "123456"
    ];

    assert.deepStrictEqual(messageSplitter.run(messageLine), expected);
  });
});