import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { State } from "../../../../src/vehicle/State.ts";
import { Speedometer } from "../../../../src/vehicle/components/speedometer/Speedometer.ts";
import SpeedometerAlike from "../../../../src/vehicle/components/speedometer/SpeedometerAlike.ts";

describe("SpeedometerAlike", function () {
  it("should correctly identify a Speedometer instance", () => {
    const state = new State<number>(200);
    const speedometer = new Speedometer(state);
    assert.strictEqual(SpeedometerAlike.run(speedometer), true);
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
    assert.strictEqual(SpeedometerAlike.run(speedometer), true);
  });

  it("should correctly identify a non-Speedometer instance", () => {
    const nonSpeedometer = {};
    assert.strictEqual(SpeedometerAlike.run(nonSpeedometer), false);
  });
});
