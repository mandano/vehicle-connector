import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { UpdateState } from "../../../../../src/vehicle/model/builders/update/components/UpdateState.ts";
import { State } from "../../../../../src/vehicle/State.ts";

describe("UpdateState", () => {
  let updateState: UpdateState;

  beforeEach(() => {
    updateState = new UpdateState();
  });

  it("should return updateBy if toBeUpdated is undefined", () => {
    const updateBy = new State<number>(1, new Date());
    const result = updateState.run(undefined, updateBy);
    assert.strictEqual(result, updateBy);
  });

  it("should return toBeUpdated if updateBy is undefined", () => {
    const toBeUpdated = new State<number>(1, new Date());
    const result = updateState.run(toBeUpdated, undefined);
    assert.strictEqual(result, toBeUpdated);
  });

  it("should return undefined if both toBeUpdated and updateBy are undefined", () => {
    const result = updateState.run(undefined, undefined);
    assert.strictEqual(result, undefined);
  });

  it("should return updateBy if updateBy has originatedAt and toBeUpdated does not", () => {
    const updateBy = new State<number>(1, new Date());
    const toBeUpdated = new State<number>(2);
    const result = updateState.run(toBeUpdated, updateBy);
    assert.strictEqual(result, updateBy);
  });

  it("should return toBeUpdated if toBeUpdated has originatedAt and updateBy does not", () => {
    const toBeUpdated = new State<number>(1, new Date());
    const updateBy = new State<number>(2);
    const result = updateState.run(toBeUpdated, updateBy);
    assert.strictEqual(result, toBeUpdated);
  });

  it("should update state and updatedAt if both originatedAt are undefined", () => {
    const toBeUpdated = new State<number>(1);
    const updateBy = new State<number>(2);
    const result = updateState.run(toBeUpdated, updateBy);
    assert.strictEqual(result?.state, updateBy.state);
    assert.ok(result?.updatedAt);
  });

  it("should update state, originatedAt, and updatedAt if updateBy originatedAt is later", () => {
    const toBeUpdated = new State<number>(1, new Date("2023-01-01"));
    const updateBy = new State<number>(2, new Date("2023-02-01"));
    const result = updateState.run(toBeUpdated, updateBy);
    assert.strictEqual(result?.state, updateBy.state);
    assert.strictEqual(result?.originatedAt, updateBy.originatedAt);
    assert.ok(result?.updatedAt);
  });

  it("should not update state if toBeUpdated originatedAt is later", () => {
    const toBeUpdated = new State<number>(1, new Date("2023-02-01"));
    const updateBy = new State<number>(2, new Date("2023-01-01"));
    const result = updateState.run(toBeUpdated, updateBy);
    assert.strictEqual(result?.state, toBeUpdated.state);
    assert.strictEqual(result?.originatedAt, toBeUpdated.originatedAt);
    assert.strictEqual(result?.updatedAt, undefined);
  });
});
