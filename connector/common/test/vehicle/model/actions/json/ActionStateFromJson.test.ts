import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { FakeLogger } from "../../../../logger/FakeLogger.ts";
import { ActionStateFromJson } from "../../../../../src/vehicle/model/actions/json/ActionStateFromJson.ts";
import { ActionState } from "../../../../../src/vehicle/model/actions/ActionState.ts";
import { Lock as LockComponent } from "../../../../../src/vehicle/components/lock/Lock.ts";
import { ActionStateTypes } from "../../../../../src/vehicle/model/actions/ActionStateTypes.ts";

describe("ActionStateFromJson", () => {
  let logger: FakeLogger;
  let actionStateFromJson: ActionStateFromJson;

  beforeEach(() => {
    logger = new FakeLogger();
    actionStateFromJson = new ActionStateFromJson(logger);
  });

  it("should log error and return undefined for invalid JSON", () => {
    const json = "invalid json";

    const result = actionStateFromJson.run(json);

    assert.strictEqual(result, undefined);
    assert(logger.loggedMessages.includes(
      `error: Failed to parse JSON: SyntaxError: Unexpected token 'i', "invalid json" is not valid JSON${ActionStateFromJson.name}`
    ));
  });

  it("should log error and return undefined for invalid ActionState", () => {
    const json = JSON.stringify({
      invalid: "data",
    });

    const result = actionStateFromJson.run(json);

    assert.strictEqual(result, undefined);
    assert(logger.loggedMessages.includes(
      `error: Invalid ActionState: {"invalid":"data"}${ActionStateFromJson.name}`,
    ));
  });

  it("should log error and return undefined for unknown action state type", () => {
    const json = JSON.stringify({
      state: LockComponent.UNLOCKED,
      id: "123",
      vehicleId: 123,
      type: "unknown",
      createdAt: "2023-01-03T00:00:00Z",
    });

    const result = actionStateFromJson.run(json);

    assert.strictEqual(result, undefined);
    assert(logger.loggedMessages.includes(
      `error: Invalid ActionState: {"state":"unlocked","id":"123","vehicleId":123,"type":"unknown","createdAt":"2023-01-03T00:00:00Z"}${ActionStateFromJson.name}`
    ));
  });

  it("should log error and return undefined for not supported state", () => {
    const json = JSON.stringify({
      state: "notSupported",
      id: "123",
      vehicleId: 123,
      type: ActionStateTypes.LOCK,
      createdAt: "2023-01-03T00:00:00Z",
    });

    const result = actionStateFromJson.run(json);

    assert.strictEqual(result, undefined);
    assert(logger.loggedMessages.includes(
      `error: Invalid ActionState: {"state":"notSupported","id":"123","vehicleId":123,"type":"LOCK","createdAt":"2023-01-03T00:00:00Z"}${ActionStateFromJson.name}`
    ));
  });

  it("should parse valid JSON and return ActionState", () => {
    const exemplaryStates = [LockComponent.LOCKED, LockComponent.UNLOCKED, 123];
    const exemplaryTypes = ActionStateTypes.SUPPORTED_TYPES;

    const randomIdx = Math.floor(Math.random() * exemplaryStates.length);

    const json = JSON.stringify({
      state: exemplaryStates[randomIdx],
      id: "123",
      vehicleId: 123,
      type: exemplaryTypes[randomIdx],
      createdAt: "2023-01-03T00:00:00Z",
    });

    const result = actionStateFromJson.run(json);

    assert(result instanceof ActionState);
    assert(result?.state === exemplaryStates[randomIdx]);
    assert(result?.id === "123");
    assert(result?.vehicleId === 123);
  });
});
