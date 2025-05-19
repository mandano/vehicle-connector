import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { State } from "../../src/vehicle/State.ts";

describe("State", () => {
  it("should initialize with the correct state", () => {
    const value = 5;
    const state = new State<number>(value);
    assert.strictEqual(state.state, value);
  });

  it("should update the state and set updatedAt", () => {
    const state = new State<number>(5);
    state.state = 10;
    assert.strictEqual(state.state, 10);
    assert.ok(state.updatedAt);
  });

  it("should set originatedAt and updatedAt correctly", () => {
    const originatedAt = new Date("2023-01-01");
    const state = new State<number>(5, originatedAt);
    assert.strictEqual(state.originatedAt, originatedAt);

    const newOriginatedAt = new Date("2023-02-01");
    state.originatedAt = newOriginatedAt;
    assert.strictEqual(state.originatedAt, newOriginatedAt);
    assert.ok(state.updatedAt);
  });

  it("should set createdAt correctly", () => {
    const createdAt = new Date("2023-01-01");
    const state = new State<number>(5, undefined, undefined, createdAt);
    assert.strictEqual(state.createdAt, createdAt);
  });

  it("should use current date for createdAt if not provided", () => {
    const state = new State<number>(5);
    assert.ok(state.createdAt);
  });

  it("should correctly identify a State object", () => {
    const state = new State<number>(5);
    assert.strictEqual(State.isState(state), true);
  });

  it("should correctly identify a generic state object as state object", () => {
    const genericState = {
      state: 5,
      createdAt: new Date(),
      updatedAt: undefined,
      originatedAt: undefined,
    };
    assert.strictEqual(State.isState(genericState), true);
  });

  it("should correctly identify a non-State object", () => {
    const nonState = { state: 5, createdAt: new Date() };
    assert.strictEqual(State.isState(nonState), false);
  });
});
