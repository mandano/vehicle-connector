import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { faker } from "@faker-js/faker";

import { State } from "../../../src/vehicle/State.ts";
import { Position } from "../../../src/vehicle/components/iot/Position.ts";

describe("Position", () => {
  let latitude: State<number>;
  let longitude: State<number>;
  let accuracy: State<number>;
  let createdAt: Date;

  beforeEach(() => {
    latitude = new State(faker.location.latitude());
    longitude = new State(faker.location.longitude());
    accuracy = new State(faker.number.float({ min: 0, max: 50 }));
    createdAt = faker.date.past();
  });

  it("should create a Position instance", () => {
    const position = new Position(latitude, longitude, createdAt, accuracy);
    assert.ok(position);
  });

  it("should return the correct latitude", () => {
    const position = new Position(latitude, longitude, createdAt, accuracy);
    assert.strictEqual(position.latitude, latitude);
  });

  it("should return the correct longitude", () => {
    const position = new Position(latitude, longitude, createdAt, accuracy);
    assert.strictEqual(position.longitude, longitude);
  });

  it("should return the correct accuracy", () => {
    const position = new Position(latitude, longitude, createdAt, accuracy);
    assert.strictEqual(position.accuracy, accuracy);
  });

  it("should return the correct createdAt date", () => {
    const position = new Position(latitude, longitude, createdAt, accuracy);
    assert.strictEqual(position.createdAt, createdAt);
  });
});
