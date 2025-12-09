import assert from "assert";
import { before, describe, it } from "node:test";

import CloneLockState from "../../../../../../../src/vehicle/components/lock/CloneLockState.ts";
import UpdateStateNoUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import UpdateLock from "../../../../../../../src/vehicle/model/builders/update/components/lock/UpdateLock.ts";
import LockStateToChanges from "../../../../../../../src/vehicle/components/lock/LockStateToChanges.ts";
import CloneState from "../../../../../../../src/vehicle/model/CloneState.ts";
import StateToChanges from "../../../../../../../src/vehicle/model/builders/update/components/state/StateToChanges.ts";
import UpdateLockState from "../../../../../../../src/vehicle/model/builders/update/components/lock/UpdateLockState.ts";
import LockState from "../../../../../../../src/vehicle/components/lock/LockState.ts";
import State from "../../../../../../../src/vehicle/State.ts";
import LockStates from "../../../../../../../src/vehicle/components/lock/LockStates.ts";
import LockChanges from "../../../../../../../src/vehicle/components/lock/LockChanges.ts";
import Lock from "../../../../../../../src/vehicle/components/lock/Lock.ts";
import ToBeUpdatedOriginatedAtUndefined
  from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined
  from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";

describe("UpdateLock", () => {
  let updateLock: UpdateLock;

  before(() => {
    const updateState = new UpdateStateNoUndefined(
      new ToBeUpdatedOriginatedAtUndefined(),
      new OriginatedAtUndefined(),
      new UpdateNoUndefined(),
    );
    const cloneLockState = new CloneLockState(new CloneState<LockStates>());
    const lockStateToChanges = new LockStateToChanges(new StateToChanges());

    const updateLockState = new UpdateLockState(
      updateState,
      cloneLockState,
      lockStateToChanges,
    );

    updateLock = new UpdateLock(
      updateLockState,
      cloneLockState,
      lockStateToChanges,
    );
  });

  describe("run", () => {
    it("returns undefined result when both toBeUpdated and updateBy are undefined", () => {
      const result = updateLock.run(undefined, undefined);

      assert.strictEqual(result.new, undefined);
      assert.strictEqual(result.changes, undefined);
    });

    it("clones updateBy.state in-place and returns LockChanges when toBeUpdated is undefined", () => {
      const originatedAt = new Date(2024, 0, 10);
      const createdAt = new Date(2024, 0, 1);

      const originalState = new LockState(
        new State<LockStates>(
          LockState.UNLOCKED,
          originatedAt,
          undefined,
          createdAt,
        ),
      );
      const updateBy = new Lock(undefined, originalState);

      const result = updateLock.run(undefined, updateBy);

      // same Lock instance is returned
      assert.strictEqual(result.new, updateBy);

      // state should be cloned by value but not the same reference
      assert.deepStrictEqual(result.new?.state, originalState);
      assert.notStrictEqual(result.new?.state, originalState);

      // changes should reflect the original state's values
      assert.ok(result.changes instanceof LockChanges);
      assert.strictEqual(result.changes?.state?.state?.state, LockState.UNLOCKED);
      assert.strictEqual(
        result.changes?.state?.state.originatedAt,
        originatedAt.toISOString(),
      );
      assert.strictEqual(
        result.changes?.state?.state.createdAt,
        createdAt.toISOString(),
      );
      // updatedAt comes from original state's updatedAt (undefined here)
      assert.strictEqual(result.changes?.state?.state.updatedAt, undefined);
    });

    it("clones toBeUpdated.state in-place and returns LockChanges when updateBy is undefined", () => {
      const originatedAt = new Date(2024, 1, 5);
      const createdAt = new Date(2024, 1, 1);

      const originalState = new LockState(
        new State<LockStates>(
          LockState.LOCKED,
          originatedAt,
          undefined,
          createdAt,
        ),
      );
      const toBeUpdated = new Lock(undefined, originalState);

      const result = updateLock.run(toBeUpdated, undefined);

      // same Lock instance is returned
      assert.strictEqual(result.new, toBeUpdated);

      // state should be cloned by value but not the same reference
      assert.deepStrictEqual(result.new?.state, originalState);
      assert.notStrictEqual(result.new?.state, originalState);

      // changes reflect the original state's values
      assert.ok(result.changes instanceof LockChanges);
      assert.strictEqual(result.changes?.state?.state?.state, LockState.LOCKED);
      assert.strictEqual(
        result.changes?.state?.state.originatedAt,
        originatedAt.toISOString(),
      );
      assert.strictEqual(
        result.changes?.state?.state.createdAt,
        createdAt.toISOString(),
      );
      assert.strictEqual(result.changes?.state?.state.updatedAt, undefined);
    });

    it("updates toBeUpdated when both defined and updateBy is newer; wraps changes in LockChanges", () => {
      const oldDate = new Date(2023, 5, 1);
      const newDate = new Date(2023, 6, 1);

      const toBeUpdated = new Lock(
        undefined,
        new LockState(new State<LockStates>(LockState.LOCKED, oldDate)),
      );
      const updateBy = new Lock(
        undefined,
        new LockState(new State<LockStates>(LockState.UNLOCKED, newDate)),
      );

      const result = updateLock.run(toBeUpdated, updateBy);

      // same lock instance should be returned
      assert.strictEqual(result.new, toBeUpdated);

      // it should now carry the updated state (from updateBy)
      assert.strictEqual(result.new?.state?.state.state, LockState.UNLOCKED);
      assert.strictEqual(result.new?.state?.state.originatedAt, newDate);

      // changes should be present and wrapped
      assert.ok(result.changes instanceof LockChanges);
      assert.strictEqual(result.changes?.state?.state?.state, LockState.UNLOCKED);
      assert.strictEqual(
        result.changes?.state?.state.originatedAt,
        newDate.toISOString(),
      );
      assert.ok(typeof result.changes?.state?.state.updatedAt === "string");
    });

    it("does not update when both defined and updateBy is older; no changes", () => {
      const oldDate = new Date(2023, 5, 1);
      const newDate = new Date(2023, 6, 1);

      const originalLockState = new LockState(
        new State<LockStates>(LockState.UNLOCKED, newDate),
      );
      const toBeUpdated = new Lock(undefined, originalLockState);
      const updateBy = new Lock(
        undefined,
        new LockState(new State<LockStates>(LockState.LOCKED, oldDate)),
      );

      const result = updateLock.run(toBeUpdated, updateBy);

      // same lock instance returned
      assert.strictEqual(result.new, toBeUpdated);

      // state should remain by value, but be re-instantiated by UpdateLockState logic
      assert.deepStrictEqual(result.new?.state, originalLockState);
      assert.notStrictEqual(result.new?.state, originalLockState);

      // no changes since updateBy was older
      assert.strictEqual(result.changes, undefined);
    });
  });
});
