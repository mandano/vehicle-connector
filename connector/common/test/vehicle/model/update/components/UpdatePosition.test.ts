import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { faker } from "@faker-js/faker";

import { UpdateState } from "../../../../../src/vehicle/model/builders/update/components/UpdateState.ts";
import { UpdatePosition } from "../../../../../src/vehicle/model/builders/update/components/UpdatePosition.ts";
import { Position } from "../../../../../src/vehicle/components/iot/Position.ts";
import { State } from "../../../../../src/vehicle/State.ts";

describe("UpdatePosition", () => {
  let updateState: UpdateState;
  let updatePosition: UpdatePosition;

  beforeEach(() => {
    updateState = new UpdateState();
    updatePosition = new UpdatePosition(updateState);
  });

  it("should not update if toBeUpdated originated newer", () => {
    const toBeUpdatedLatitude = new State(
      faker.location.latitude(),
      new Date("2000-01-02"),
      undefined,
      new Date(),
    );
    const toBeUpdatedLongitude = new State(
      faker.location.longitude(),
      new Date("2000-01-02"),
      undefined,
      new Date(),
    );
    const toBeUpdatedAccuracy = new State(
      faker.number.int({ min: 1, max: 5 }),
      new Date("2000-01-02"),
      undefined,
      new Date(),
    );

    const toBeUpdated: Position = new Position(
      toBeUpdatedLatitude,
      toBeUpdatedLongitude,
      new Date(),
      toBeUpdatedAccuracy,
    );

    const updateByLatitude = new State(
      faker.location.latitude(),
      new Date("2000-01-01"),
      undefined,
      new Date(),
    );
    const updateByLongitude = new State(
      faker.location.longitude(),
      new Date("2000-01-01"),
      undefined,
      new Date(),
    );
    const updateByAccuracy = new State(
      faker.number.int({ min: 1, max: 5 }),
      new Date("2000-01-01"),
      undefined,
      new Date(),
    );

    const updateBy: Position = new Position(
      updateByLatitude,
      updateByLongitude,
      new Date(),
      updateByAccuracy,
    );

    const result = updatePosition.run(toBeUpdated, updateBy);

    assert.strictEqual(result.latitude, toBeUpdatedLatitude);
    assert.strictEqual(result.longitude, toBeUpdatedLongitude);
    assert.strictEqual(result.accuracy, toBeUpdatedAccuracy);
    assert.strictEqual(
      result.latitude.originatedAt,
      toBeUpdated.latitude.originatedAt,
    );
    assert.strictEqual(
      result.longitude.originatedAt,
      toBeUpdated.longitude.originatedAt,
    );
    assert.strictEqual(
      result.accuracy?.originatedAt,
      toBeUpdated.accuracy?.originatedAt,
    );
  });

  it("should update if toBeUpdated originated older", () => {
    const toBeUpdatedLatitude = new State(
      faker.location.latitude(),
      new Date("2000-01-02"),
      undefined,
      new Date(),
    );
    const toBeUpdatedLongitude = new State(
      faker.location.longitude(),
      new Date("2000-01-02"),
      undefined,
      new Date(),
    );
    const toBeUpdatedAccuracy = new State(
      faker.number.int({ min: 1, max: 5 }),
      new Date("2000-01-02"),
      undefined,
      new Date(),
    );

    const toBeUpdated: Position = new Position(
      toBeUpdatedLatitude,
      toBeUpdatedLongitude,
      new Date(),
      toBeUpdatedAccuracy,
    );

    const updateByLatitude = new State(
      faker.location.latitude(),
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );
    const updateByLongitude = new State(
      faker.location.longitude(),
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );
    const updateByAccuracy = new State(
      faker.number.int({ min: 1, max: 5 }),
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );

    const updateBy: Position = new Position(
      updateByLatitude,
      updateByLongitude,
      new Date(),
      updateByAccuracy,
    );

    const result = updatePosition.run(toBeUpdated, updateBy);

    assert.strictEqual(result.latitude.state, updateByLatitude.state);
    assert.strictEqual(result.longitude.state, updateByLongitude.state);
    assert.strictEqual(result.accuracy?.state, updateByAccuracy.state);
    assert.strictEqual(
      result.latitude.originatedAt,
      updateBy.latitude.originatedAt,
    );
    assert.strictEqual(
      result.longitude.originatedAt,
      updateBy.longitude.originatedAt,
    );
    assert.strictEqual(
      result.accuracy?.originatedAt,
      updateBy.accuracy?.originatedAt,
    );
  });

  it("should update accuracy if toBeUpdated accuracy undefined", () => {
    const toBeUpdatedLatitude = new State(
      faker.location.latitude(),
      new Date("2000-01-02"),
      undefined,
      new Date(),
    );
    const toBeUpdatedLongitude = new State(
      faker.location.longitude(),
      new Date("2000-01-02"),
      undefined,
      new Date(),
    );

    const toBeUpdated: Position = new Position(
      toBeUpdatedLatitude,
      toBeUpdatedLongitude,
      new Date(),
      undefined,
    );

    const updateByLatitude = new State(
      faker.location.latitude(),
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );
    const updateByLongitude = new State(
      faker.location.longitude(),
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );
    const updateByAccuracy = new State(
      faker.number.int({ min: 1, max: 5 }),
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );

    const updateBy: Position = new Position(
      updateByLatitude,
      updateByLongitude,
      new Date(),
      updateByAccuracy,
    );

    const result = updatePosition.run(toBeUpdated, updateBy);

    assert.strictEqual(result.accuracy, updateByAccuracy);
    assert.strictEqual(
      result.accuracy?.originatedAt,
      updateBy.accuracy?.originatedAt,
    );
  });

  it("should not update accuracy if updateBy accuracy undefined", () => {
    const toBeUpdatedLatitude = new State(
      faker.location.latitude(),
      new Date("2000-01-02"),
      undefined,
      new Date(),
    );
    const toBeUpdatedLongitude = new State(
      faker.location.longitude(),
      new Date("2000-01-02"),
      undefined,
      new Date(),
    );
    const toBeUpdatedAccuracy = new State(
      faker.number.int({ min: 1, max: 5 }),
      new Date("2000-01-02"),
      undefined,
      new Date(),
    );

    const toBeUpdated: Position = new Position(
      toBeUpdatedLatitude,
      toBeUpdatedLongitude,
      new Date(),
      toBeUpdatedAccuracy,
    );

    const updateByLatitude = new State(
      faker.location.latitude(),
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );
    const updateByLongitude = new State(
      faker.location.longitude(),
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );

    const updateBy: Position = new Position(
      updateByLatitude,
      updateByLongitude,
      new Date(),
      undefined,
    );

    const result = updatePosition.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(result.accuracy, toBeUpdatedAccuracy);
    assert.notStrictEqual(result.accuracy, toBeUpdatedAccuracy);

    assert.strictEqual(
      result.accuracy?.originatedAt,
      toBeUpdated.accuracy?.originatedAt,
    );
  });
});
