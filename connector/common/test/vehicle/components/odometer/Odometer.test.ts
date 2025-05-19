import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { State } from "../../../../src/vehicle/State.ts";
import { Odometer } from "../../../../src/vehicle/components/odometer/Odometer.ts";

describe("Odometer", function () {
  it("should create an instance of Odometer", () => {
    const state = new State<number>(0);
    const odometer = new Odometer(state);
    assert.ok(odometer);
  });

  it("should return the correct state", () => {
    const state = new State<number>(100);
    const odometer = new Odometer(state);
    assert.strictEqual(odometer.state, state);
  });

  it("should correctly identify an Odometer instance", () => {
    const state = new State<number>(200);
    const odometer = new Odometer(state);
    assert.strictEqual(Odometer.isOdometer(odometer), true);
  });

  it("should correctly identify generic odometer object", () => {
    const odometer = {
      state: {
        state: 5,
        createdAt: new Date(),
        updatedAt: undefined,
        originatedAt: undefined,
      },
    };
    assert.strictEqual(Odometer.isOdometer(odometer), true);
  });

  it("should correctly identify a non-Odometer instance", () => {
    const nonOdometer = {};
    assert.strictEqual(Odometer.isOdometer(nonOdometer), false);
  });
});
