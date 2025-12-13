import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { State } from "../../../../src/vehicle/State.ts";
import { Speedometer } from "../../../../src/vehicle/components/speedometer/Speedometer.ts";

describe("Speedometer", function () {
  it("should create an instance of Speedometer", () => {
    const state = new State<number>(0);
    const speedometer = new Speedometer(state);
    assert.ok(speedometer);
  });

  it("should return the correct state", () => {
    const state = new State<number>(100);
    const speedometer = new Speedometer(state);
    assert.strictEqual(speedometer.state, state);
  });
});
