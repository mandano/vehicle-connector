import assert from "assert";
import { before, describe, it } from "node:test";

import State from "../../../../../../src/vehicle/State.ts";
import UpdateStateNoUndefined from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import ToBeUpdatedOriginatedAtUndefined
  from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined
  from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";

describe("UpdateStateNoUndefined", () => {
  let updateState: UpdateStateNoUndefined;

  before(() => {
    updateState = new UpdateStateNoUndefined(
      new ToBeUpdatedOriginatedAtUndefined(),
      new OriginatedAtUndefined(),
      new UpdateNoUndefined(),
    );
  });

  describe("run", () => {
    it("should update when updateBy.originatedAt is defined and toBeUpdated.originatedAt is undefined", () => {
      const newDate = new Date();
      const toBeUpdated = new State<string>("old", undefined);
      const updateBy = new State<string>("new", newDate);

      const result = updateState.run(toBeUpdated, updateBy);

      assert.notStrictEqual(result.new, updateBy);

      assert.strictEqual(result.new.state, updateBy.state);
      assert.strictEqual(result.new.originatedAt, updateBy.originatedAt);

      if (!result.new.updatedAt) {
        assert.fail("updatedAt is undefined");
      }
      assert.ok(result.new.updatedAt instanceof Date)
      assert.ok(result.new.updatedAt >= newDate);
      assert.strictEqual(result.new.createdAt, toBeUpdated.createdAt);
    });

    it("should update when updateBy.originatedAt is defined and toBeUpdated.originatedAt is undefined - check changes", () => {
      const newDate = new Date();
      const toBeUpdated = new State<string>("old", undefined);
      const updateBy = new State<string>("new", newDate);

      const result = updateState.run(toBeUpdated, updateBy);

      assert.notStrictEqual(result.changes, undefined);
      assert.strictEqual(result.changes?.state, "new");
      assert.strictEqual(result.changes?.originatedAt, newDate.toISOString());

      if (!result.changes.updatedAt) {
        assert.fail("updatedAt is undefined");
      }

      const updateAtAsStr = result.changes.updatedAt;
      const updateAt = new Date(updateAtAsStr);

      assert.ok(updateAt >= newDate);
    });

    it("should not update when updateBy.originatedAt is undefined and toBeUpdated.originatedAt is defined", () => {
      const toBeUpdated = new State<string>("old", new Date());
      const updateBy = new State<string>("new", undefined);

      const result = updateState.run(toBeUpdated, updateBy);

      assert.deepStrictEqual(result.new, toBeUpdated);
      assert.notStrictEqual(result.new, toBeUpdated);
    });

    it("should not update when updateBy.originatedAt is undefined and toBeUpdated.originatedAt is defined - check changes", () => {
      const toBeUpdated = new State<string>("old", new Date());
      const updateBy = new State<string>("new", undefined);

      const result = updateState.run(toBeUpdated, updateBy);

      assert.strictEqual(result.changes, undefined);
    });

    it("should update when both originatedAt are undefined", () => {
      const toBeUpdated = new State<string>("old", undefined);
      const updateBy = new State<string>("new", undefined);

      const result = updateState.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.state, "new");
    });

    it("should update when both originatedAt are undefined - check changes", () => {
      const toBeUpdated = new State<string>("old", undefined);
      const updateBy = new State<string>("new", undefined);

      const result = updateState.run(toBeUpdated, updateBy);

      assert.strictEqual(result.changes?.state, "new");
      assert.notStrictEqual(result.changes?.updatedAt, undefined);
    });

    it("should update when updateBy.originatedAt is newer than toBeUpdated.originatedAt", () => {
      const oldDate = new Date(2022, 1, 1);
      const newDate = new Date(2022, 1, 2);
      const toBeUpdated = new State<string>("old", oldDate);
      const updateBy = new State<string>("new", newDate);

      const result = updateState.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.state, "new");
      assert.strictEqual(result.new?.originatedAt, newDate);

      if (!result.new.updatedAt) {
        assert.fail("updatedAt is undefined");
      }
      assert.ok(result.new.updatedAt instanceof Date)
      assert.ok(result.new.updatedAt >= newDate);
      assert.strictEqual(result.new.createdAt, toBeUpdated.createdAt);
    });

    it("should update when updateBy.originatedAt is newer than toBeUpdated.originatedAt - check changes", () => {
      const oldDate = new Date(2022, 1, 1);
      const newDate = new Date(2022, 1, 2);
      const toBeUpdated = new State<string>("old", oldDate);
      const updateBy = new State<string>("new", newDate);

      const result = updateState.run(toBeUpdated, updateBy);

      assert.strictEqual(result.changes?.state, "new");
      assert.strictEqual(result.changes?.originatedAt, newDate.toISOString());

      if (!result.changes.updatedAt) {
        assert.fail("updatedAt is undefined");
      }

      const updateAtAsStr = result.changes.updatedAt;
      const updateAt = new Date(updateAtAsStr);

      assert.ok(updateAt >= newDate);
    });

    it("should not update when updateBy.originatedAt is older than toBeUpdated.originatedAt", () => {
      const oldDate = new Date(2022, 1, 1);
      const newDate = new Date(2022, 1, 2);
      const toBeUpdated = new State<string>("old", newDate);
      const updateBy = new State<string>("new", oldDate);

      const result = updateState.run(toBeUpdated, updateBy);

      assert.deepStrictEqual(result.new, toBeUpdated);
      assert.notStrictEqual(result.new, toBeUpdated);
    });

    it("should not update when updateBy.originatedAt is older than toBeUpdated.originatedAt - check changes", () => {
      const oldDate = new Date(2022, 1, 1);
      const newDate = new Date(2022, 1, 2);
      const toBeUpdated = new State<string>("old", newDate);
      const updateBy = new State<string>("new", oldDate);

      const result = updateState.run(toBeUpdated, updateBy);

      assert.strictEqual(result.changes, undefined);
    });

    it("should not update when updateBy.originatedAt equals toBeUpdated.originatedAt", () => {
      const date = new Date(2022, 1, 1);
      const toBeUpdated = new State<string>("old", date);
      const updateBy = new State<string>("new", date);

      const result = updateState.run(toBeUpdated, updateBy);

      assert.deepStrictEqual(result.new, toBeUpdated);
      assert.notStrictEqual(result.new, toBeUpdated);
    });

    it("should not update when updateBy.originatedAt equals toBeUpdated.originatedAt - check changes", () => {
      const date = new Date(2022, 1, 1);
      const toBeUpdated = new State<string>("old", date);
      const updateBy = new State<string>("new", date);

      const result = updateState.run(toBeUpdated, updateBy);

      assert.strictEqual(result.changes, undefined);
    });
  });
});
