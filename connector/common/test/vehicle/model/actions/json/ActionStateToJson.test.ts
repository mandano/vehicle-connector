import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { ActionState } from "../../../../../src/vehicle/model/actions/ActionState.ts";
import { ActionStateToJson } from "../../../../../src/vehicle/model/actions/json/ActionStateToJson.ts";
import { Lock as LockComponent } from "../../../../../src/vehicle/components/lock/Lock.ts";
import { ActionStateTypes } from "../../../../../src/vehicle/model/actions/ActionStateTypes.ts";

describe("ActionStateToJson", () => {
  it("should convert ActionState to JSON string", () => {
    const actionState = new ActionState(
      LockComponent.LOCKED,
      "trackingId",
      new Date("2023-01-01T00:00:00Z"),
      123,
      ActionStateTypes.LOCK,
    );

    const jsonString = ActionStateToJson.run(actionState);
    assert.strictEqual(
      jsonString,
      JSON.stringify({
        id: actionState.id,
        state: actionState.state,
        createdAt: actionState.createdAt.toISOString(),
        vehicleId: actionState.vehicleId,
        type: actionState.type,
      }),
    );
  });
});
