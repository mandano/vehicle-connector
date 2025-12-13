import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { faker } from "@faker-js/faker";

import UpdatePosition from "../../../../../src/vehicle/model/builders/update/components/position/UpdatePosition.ts";
import Position from "../../../../../src/vehicle/components/iot/Position.ts";
import State from "../../../../../src/vehicle/State.ts";
import UpdateStateNoUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import PositionChanges from "../../../../../src/vehicle/model/builders/update/components/position/PositionChanges.ts";
import StateToChanges from "../../../../../src/vehicle/model/builders/update/components/state/StateToChanges.ts";
import UpdateState from "../../../../../src/vehicle/model/builders/update/components/state/UpdateState.ts";
import CloneStateExt from "../../../../../src/vehicle/model/CloneStateExt.ts";
import ToBeUpdatedOriginatedAtUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";
import PositionToChanges from "../../../../../src/vehicle/components/iot/position/PositionToChanges.ts";
import ClonePosition from "../../../../../src/vehicle/components/iot/position/ClonePosition.ts";

describe("UpdatePosition", () => {
  let updateState: UpdateState;
  let updatePosition: UpdatePosition;

  beforeEach(() => {
    updateState = new UpdateState(
      new UpdateStateNoUndefined(
        new ToBeUpdatedOriginatedAtUndefined(),
        new OriginatedAtUndefined(),
        new UpdateNoUndefined(),
      ),
      new StateToChanges(),
      new CloneStateExt(),
    );

    updatePosition = new UpdatePosition(
      updateState,
      new ClonePosition(),
      new PositionToChanges(),
    );
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

    const updatePositionResult = updatePosition.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(
      updatePositionResult.new?.latitude,
      toBeUpdatedLatitude,
    );
    assert.deepStrictEqual(
      updatePositionResult.new?.longitude,
      toBeUpdatedLongitude,
    );
    assert.deepStrictEqual(
      updatePositionResult.new?.accuracy,
      toBeUpdatedAccuracy,
    );
    assert.strictEqual(
      updatePositionResult.new.latitude.originatedAt,
      toBeUpdated.latitude.originatedAt,
    );
    assert.strictEqual(
      updatePositionResult.new.longitude.originatedAt,
      toBeUpdated.longitude.originatedAt,
    );
    assert.strictEqual(
      updatePositionResult.new.accuracy?.originatedAt,
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

    const updatePositionResult = updatePosition.run(toBeUpdated, updateBy);

    assert.strictEqual(
      updatePositionResult.new?.latitude.state,
      updateByLatitude.state,
    );
    assert.strictEqual(
      updatePositionResult.new?.longitude.state,
      updateByLongitude.state,
    );
    assert.strictEqual(
      updatePositionResult.new?.accuracy?.state,
      updateByAccuracy.state,
    );
    assert.strictEqual(
      updatePositionResult.new.latitude.originatedAt,
      updateBy.latitude.originatedAt,
    );
    assert.strictEqual(
      updatePositionResult.new.longitude.originatedAt,
      updateBy.longitude.originatedAt,
    );
    assert.strictEqual(
      updatePositionResult.new.accuracy?.originatedAt,
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

    const updatePositionResult = updatePosition.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(updatePositionResult.new?.accuracy, updateByAccuracy);
    assert.strictEqual(
      updatePositionResult.new.accuracy?.originatedAt,
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

    const updatePositionResult = updatePosition.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(
      updatePositionResult.new?.accuracy,
      toBeUpdatedAccuracy,
    );
    assert.strictEqual(
      updatePositionResult.new.accuracy?.originatedAt,
      toBeUpdated.accuracy?.originatedAt,
    );
  });

  // TODO: create by AI, double check
  it("should provide changes for latitude, longitude, and accuracy when updated by newer data", () => {
    // Prepare deterministic values to avoid faker collisions
    const toBeUpdatedLatitude = new State(
      10.12345,
      new Date("2000-01-01"),
      undefined,
      new Date(),
    );
    const toBeUpdatedLongitude = new State(
      20.54321,
      new Date("2000-01-01"),
      undefined,
      new Date(),
    );
    const toBeUpdatedAccuracy = new State(
      3,
      new Date("2000-01-01"),
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
      11.11111,
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );
    const updateByLongitude = new State(
      22.22222,
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );
    const updateByAccuracy = new State(
      5,
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
    const changes: PositionChanges | undefined = result.changes;

    // Ensure changes object exists
    assert.ok(changes !== undefined);

    // Latitude changes
    assert.strictEqual(changes?.latitude?.state, updateByLatitude.state);
    assert.strictEqual(
      changes?.latitude?.originatedAt,
      updateByLatitude.originatedAt?.toISOString(),
    );
    assert.ok(typeof changes?.latitude?.updatedAt === "string");

    // Longitude changes
    assert.strictEqual(changes?.longitude?.state, updateByLongitude.state);
    assert.strictEqual(
      changes?.longitude?.originatedAt,
      updateByLongitude.originatedAt?.toISOString(),
    );
    assert.ok(typeof changes?.longitude?.updatedAt === "string");

    // Accuracy changes
    assert.strictEqual(changes?.accuracy?.state, updateByAccuracy.state);
    assert.strictEqual(
      changes?.accuracy?.originatedAt,
      updateByAccuracy.originatedAt?.toISOString(),
    );
    assert.ok(typeof changes?.accuracy?.updatedAt === "string");
  });

  it("should not provide changes when toBeUpdated is newer (no updates applied)", () => {
    const toBeUpdatedLatitude = new State(
      10,
      new Date("2000-01-04"),
      undefined,
      new Date(),
    );
    const toBeUpdatedLongitude = new State(
      20,
      new Date("2000-01-04"),
      undefined,
      new Date(),
    );
    const toBeUpdatedAccuracy = new State(
      3,
      new Date("2000-01-04"),
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
      11,
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );
    const updateByLongitude = new State(
      22,
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );
    const updateByAccuracy = new State(
      5,
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
    const changes: PositionChanges | undefined = result.changes;

    assert.strictEqual(changes, undefined);
  });

  it("should provide changes only for accuracy when only accuracy is updated", () => {
    // Lat/Lon equal and same originatedAt to avoid changes
    const commonOrigin = new Date("2000-01-02");

    const lat = new State(12.34, commonOrigin, undefined, new Date());
    const lon = new State(56.78, commonOrigin, undefined, new Date());

    const toBeUpdatedAcc = new State(
      2,
      new Date("2000-01-01"),
      undefined,
      new Date(),
    );
    const updateByAcc = new State(
      4,
      new Date("2000-01-03"),
      undefined,
      new Date(),
    );

    const toBeUpdated: Position = new Position(
      lat,
      lon,
      new Date(),
      toBeUpdatedAcc,
    );
    const updateBy: Position = new Position(lat, lon, new Date(), updateByAcc);

    const result = updatePosition.run(toBeUpdated, updateBy);
    const changes: PositionChanges | undefined = result.changes;

    // Lat/Lon changes should be undefined
    assert.strictEqual(changes?.latitude, undefined);
    assert.strictEqual(changes?.longitude, undefined);

    // Accuracy should have changes
    assert.strictEqual(changes?.accuracy?.state, updateByAcc.state);
    assert.strictEqual(
      changes?.accuracy?.originatedAt,
      updateByAcc.originatedAt?.toISOString(),
    );
    assert.ok(typeof changes?.accuracy?.updatedAt === "string");
  });
});
