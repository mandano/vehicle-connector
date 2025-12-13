import assert from "assert";
import { beforeEach, describe, it } from "node:test";

import UpdateState from "../../../../../../../src/vehicle/model/builders/update/components/state/UpdateState.ts";
import UpdateStateNoUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import StateToChanges from "../../../../../../../src/vehicle/model/builders/update/components/state/StateToChanges.ts";
import CloneStateExt from "../../../../../../../src/vehicle/model/CloneStateExt.ts";
import State from "../../../../../../../src/vehicle/State.ts";
import ToBeUpdatedOriginatedAtUndefined
  from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined
  from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";


describe("UpdateState (integration)", () => {
  let updateState: UpdateState;

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
  });

  describe("run", () => {
    it("returns undefined new and changes when both inputs are undefined", () => {
      const result = updateState.run<string>(undefined, undefined);

      assert.strictEqual(result.new, undefined);
      assert.strictEqual(result.changes, undefined);
    });

    it("clones updateBy and returns changes via StateToChanges when toBeUpdated is undefined", () => {
      const originatedAt = new Date(2024, 0, 1, 10, 0, 0);
      const createdAt = new Date(2024, 0, 1, 9, 0, 0);
      const updateBy = new State<string>(
        "new",
        originatedAt,
        undefined,
        createdAt,
      );

      const result = updateState.run<string>(undefined, updateBy);

      // new is a clone of updateBy (same values, different reference)
      assert.deepStrictEqual(
        {
          state: result.new?.state,
          originatedAt: result.new?.originatedAt,
          updatedAt: result.new?.updatedAt,
          createdAt: result.new?.createdAt,
        },
        {
          state: updateBy.state,
          originatedAt: updateBy.originatedAt,
          updatedAt: updateBy.updatedAt,
          createdAt: updateBy.createdAt,
        },
      );
      assert.notStrictEqual(result.new, updateBy);

      // changes are built using StateToChanges
      assert.ok(result.changes);
      assert.strictEqual(result.changes?.state, "new");
      assert.strictEqual(
        result.changes?.originatedAt,
        originatedAt.toISOString(),
      );
      assert.strictEqual(result.changes?.createdAt, createdAt.toISOString());
      // updatedAt is undefined here because updateBy had no updatedAt
      assert.strictEqual(result.changes?.updatedAt, undefined);
    });

    it("clones toBeUpdated and returns no changes when updateBy is undefined", () => {
      const originatedAt = new Date(2024, 0, 2, 12, 0, 0);
      const updatedAt = new Date(2024, 0, 2, 12, 30, 0);
      const createdAt = new Date(2024, 0, 2, 11, 0, 0);
      const toBeUpdated = new State<string>(
        "old",
        originatedAt,
        updatedAt,
        createdAt,
      );

      const result = updateState.run<string>(toBeUpdated, undefined);

      // new is a clone of toBeUpdated (same values, different reference)
      assert.deepStrictEqual(
        {
          state: result.new?.state,
          originatedAt: result.new?.originatedAt,
          updatedAt: result.new?.updatedAt,
          createdAt: result.new?.createdAt,
        },
        {
          state: toBeUpdated.state,
          originatedAt: toBeUpdated.originatedAt,
          updatedAt: toBeUpdated.updatedAt,
          createdAt: toBeUpdated.createdAt,
        },
      );
      assert.notStrictEqual(result.new, toBeUpdated);
      assert.strictEqual(result.changes, undefined);
    });

    it("delegates to UpdateStateNoUndefined: updates when updateBy.originatedAt is newer", () => {
      const toBeUpdatedCreatedAt = new Date(2024, 0, 3, 8, 0, 0);
      const toBeUpdatedOriginatedAt = new Date(2024, 0, 3, 9, 0, 0);
      const toBeUpdated = new State<string>(
        "old",
        toBeUpdatedOriginatedAt,
        undefined,
        toBeUpdatedCreatedAt,
      );

      const updateByOriginatedAt = new Date(2024, 0, 3, 10, 0, 0); // newer
      const updateBy = new State<string>(
        "new",
        updateByOriginatedAt,
        undefined,
        new Date(2024, 0, 3, 10, 0, 0),
      );

      const result = updateState.run<string>(toBeUpdated, updateBy);

      // It should take the state and originatedAt from updateBy, but createdAt from toBeUpdated
      assert.strictEqual(result.new?.state, "new");
      assert.strictEqual(
        result.new?.originatedAt?.getTime(),
        updateByOriginatedAt.getTime(),
      );
      assert.strictEqual(
        result.new?.createdAt.getTime(),
        toBeUpdatedCreatedAt.getTime(),
      );
      // updatedAt is set to 'now' inside UpdateStateNoUndefined, ensure it's a Date and >= originatedAt
      assert.ok(result.new?.updatedAt instanceof Date);
      assert.ok((result.new?.updatedAt as Date) >= updateByOriginatedAt);

      // changes should reflect new state and originatedAt, and include updatedAt
      assert.ok(result.changes);
      assert.strictEqual(result.changes?.state, "new");
      assert.strictEqual(
        result.changes?.originatedAt,
        updateByOriginatedAt.toISOString(),
      );
      assert.ok(result.changes?.updatedAt !== undefined);
    });

    it("delegates to UpdateStateNoUndefined: does not update when updateBy.originatedAt is older", () => {
      const newer = new Date(2024, 0, 4, 10, 0, 0);
      const older = new Date(2024, 0, 4, 9, 0, 0);
      const toBeUpdated = new State<string>(
        "stay",
        newer,
        undefined,
        new Date(2024, 0, 4, 8, 0, 0),
      );
      const updateBy = new State<string>(
        "ignored",
        older,
        undefined,
        new Date(2024, 0, 4, 7, 0, 0),
      );

      const result = updateState.run<string>(toBeUpdated, updateBy);

      // No update: new equals clone of toBeUpdated
      assert.deepStrictEqual(
        {
          state: result.new?.state,
          originatedAt: result.new?.originatedAt,
          createdAt: result.new?.createdAt,
        },
        {
          state: toBeUpdated.state,
          originatedAt: toBeUpdated.originatedAt,
          createdAt: toBeUpdated.createdAt,
        },
      );
      assert.notStrictEqual(result.new, toBeUpdated);
      assert.strictEqual(result.changes, undefined);
    });

    it("delegates to UpdateStateNoUndefined: does not update when originatedAt are equal", () => {
      const date = new Date(2024, 0, 5, 10, 0, 0);
      const toBeUpdated = new State<string>(
        "same",
        date,
        undefined,
        new Date(2024, 0, 5, 8, 0, 0),
      );
      const updateBy = new State<string>(
        "newer-but-equal-origin",
        date,
        undefined,
        new Date(2024, 0, 5, 9, 0, 0),
      );

      const result = updateState.run<string>(toBeUpdated, updateBy);

      assert.deepStrictEqual(
        { state: result.new?.state, originatedAt: result.new?.originatedAt },
        { state: toBeUpdated.state, originatedAt: toBeUpdated.originatedAt },
      );
      assert.notStrictEqual(result.new, toBeUpdated);
      assert.strictEqual(result.changes, undefined);
    });

    it("delegates to UpdateStateNoUndefined: updates when both originatedAt are undefined", () => {
      const toBeUpdated = new State<string>(
        "old",
        undefined,
        undefined,
        new Date(2024, 0, 6, 8, 0, 0),
      );
      const updateBy = new State<string>(
        "new",
        undefined,
        undefined,
        new Date(2024, 0, 6, 9, 0, 0),
      );

      const result = updateState.run<string>(toBeUpdated, updateBy);

      // Should take the 'state' from updateBy, originatedAt remains undefined, createdAt from toBeUpdated
      assert.strictEqual(result.new?.state, "new");
      assert.strictEqual(result.new?.originatedAt, undefined);
      assert.strictEqual(
        result.new?.createdAt.getTime(),
        toBeUpdated.createdAt.getTime(),
      );
      assert.ok(result.new?.updatedAt instanceof Date);

      assert.ok(result.changes);
      assert.strictEqual(result.changes?.state, "new");
      assert.ok(result.changes?.updatedAt !== undefined);
      assert.strictEqual(result.changes?.originatedAt, undefined);
    });
  });
});
