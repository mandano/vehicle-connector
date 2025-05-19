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

  it("should correctly identify a Speedometer instance", () => {
    const state = new State<number>(200);
    const speedometer = new Speedometer(state);
    assert.strictEqual(Speedometer.isSpeedometer(speedometer), true);
  });

  it("should correctly identify a generic speedometer object", () => {
    const speedometer = {
      state: {
        state: 5,
        createdAt: new Date(),
        updatedAt: undefined,
        originatedAt: undefined,
      },
    };
    assert.strictEqual(Speedometer.isSpeedometer(speedometer), true);
  });

  it("should correctly identify a non-Speedometer instance", () => {
    const nonSpeedometer = {};
    assert.strictEqual(Speedometer.isSpeedometer(nonSpeedometer), false);
  });
});
