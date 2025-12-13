import assert from "assert";
import { before, describe, it } from "node:test";

import State from "../../../../../../src/vehicle/State.ts";
import LockState from "../../../../../../src/vehicle/components/lock/LockState.ts";
import LockStates from "../../../../../../src/vehicle/components/lock/LockStates.ts";
import UpdateLockState from "../../../../../../src/vehicle/model/builders/update/components/lock/UpdateLockState.ts";
import UpdateStateNoUndefined from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import CloneState from "../../../../../../src/vehicle/model/CloneState.ts";
import CloneLockState from "../../../../../../src/vehicle/components/lock/CloneLockState.ts";
import LockStateToChanges from "../../../../../../src/vehicle/components/lock/LockStateToChanges.ts";
import StateToChanges from "../../../../../../src/vehicle/model/builders/update/components/state/StateToChanges.ts";
import ToBeUpdatedOriginatedAtUndefined
  from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined
  from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";

describe("UpdateLockState", () => {
  let updateLockState: UpdateLockState;
  let updateState: UpdateStateNoUndefined;
  let cloneLockState: CloneLockState;
  let lockStateToChanges: LockStateToChanges;

  before(() => {
    updateState = new UpdateStateNoUndefined(
      new ToBeUpdatedOriginatedAtUndefined(),
      new OriginatedAtUndefined(),
      new UpdateNoUndefined(),
    );
    cloneLockState = new CloneLockState(new CloneState<LockStates>());
    lockStateToChanges = new LockStateToChanges(new StateToChanges());

    updateLockState = new UpdateLockState(
      updateState,
      cloneLockState,
      lockStateToChanges,
    );
  });

  describe("run", () => {
    it("should return updated result when both states are defined and updateBy is newer", () => {
      const oldDate = new Date(2022, 1, 1);
      const newDate = new Date(2022, 1, 2);

      const toBeUpdated = new LockState(
        new State<LockStates>(LockState.LOCKED, oldDate),
      );
      const updateBy = new LockState(
        new State<LockStates>(LockState.UNLOCKED, newDate),
      );

      const result = updateLockState.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.state.state, LockState.UNLOCKED);
      assert.strictEqual(result.new?.state.originatedAt, newDate);

      assert.strictEqual(result.changes?.state?.state, LockState.UNLOCKED);
      assert.strictEqual(result.changes?.state?.originatedAt, newDate.toISOString());
      assert.ok(typeof result.changes?.state?.updatedAt === "string");
    });

    it("should return not updated result when both states are defined but updateBy is older", () => {
      const oldDate = new Date(2022, 1, 1);
      const newDate = new Date(2022, 1, 2);

      const toBeUpdated = new LockState(
        new State<LockStates>(LockState.LOCKED, newDate),
      );
      const updateBy = new LockState(
        new State<LockStates>(LockState.UNLOCKED, oldDate),
      );

      const result = updateLockState.run(toBeUpdated, updateBy);

      assert.deepStrictEqual(result.new, toBeUpdated);
      assert.notStrictEqual(result.new, toBeUpdated);

      assert.strictEqual(result.changes, undefined);
    });

    it("should return updated result when both states have undefined originatedAt", () => {
      const toBeUpdated = new LockState(
        new State<LockStates>(LockState.LOCKED, undefined),
      );
      const updateBy = new LockState(
        new State<LockStates>(LockState.UNLOCKED, undefined),
      );

      const result = updateLockState.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.state.state, LockState.UNLOCKED);
      assert.strictEqual(result.new?.state.originatedAt, undefined);

      assert.strictEqual(result.changes?.state?.state, LockState.UNLOCKED);
      assert.ok(typeof result.changes?.state?.updatedAt === "string");
    });

    it("should return updated result when toBeUpdated.originatedAt is undefined and updateBy.originatedAt is defined", () => {
      const updateDate = new Date();

      const toBeUpdated = new LockState(
        new State<LockStates>(LockState.LOCKED, undefined),
      );
      const updateBy = new LockState(
        new State<LockStates>(LockState.UNLOCKED, updateDate),
      );

      const result = updateLockState.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.state.state, LockState.UNLOCKED);
      assert.strictEqual(result.new?.state.originatedAt, updateDate);

      assert.strictEqual(result.changes?.state?.state, LockState.UNLOCKED);
      assert.strictEqual(
        result.changes?.state?.originatedAt,
        updateDate.toISOString(),
      );
    });

    it("should return not updated result when toBeUpdated.originatedAt is defined and updateBy.originatedAt is undefined", () => {
      const updateDate = new Date();

      const toBeUpdated = new LockState(
        new State<LockStates>(LockState.LOCKED, updateDate),
      );
      const updateBy = new LockState(
        new State<LockStates>(LockState.UNLOCKED, undefined),
      );

      const result = updateLockState.run(toBeUpdated, updateBy);

      assert.deepStrictEqual(result.new, toBeUpdated);
      assert.notStrictEqual(result.new, toBeUpdated);
      assert.strictEqual(result.changes, undefined);
    });

    it("should return not updated result when both states have the same originatedAt", () => {
      const sameDate = new Date(2022, 1, 1);

      const toBeUpdated = new LockState(
        new State<LockStates>(LockState.LOCKED, sameDate),
      );
      const updateBy = new LockState(
        new State<LockStates>(LockState.UNLOCKED, sameDate),
      );

      const result = updateLockState.run(toBeUpdated, updateBy);

      assert.deepStrictEqual(result.new, toBeUpdated);
      assert.notStrictEqual(result.new, toBeUpdated);
    });

    it("should return undefined result when both toBeUpdated and updateBy are undefined", () => {
      const result = updateLockState.run(undefined, undefined);

      assert.strictEqual(result.new, undefined);
      assert.strictEqual(result.changes, undefined);
    });

    it("should clone updateBy and return changes when toBeUpdated is undefined and updateBy is defined", () => {
      const date = new Date(2023, 1, 1);
      const createdAt = new Date(2023, 1, 1);

      const updateBy = new LockState(
        new State<LockStates>(LockState.UNLOCKED, date, undefined, createdAt),
      );

      const result = updateLockState.run(undefined, updateBy);

      // cloned by value but not the same reference
      assert.deepStrictEqual(result.new, updateBy);
      assert.notStrictEqual(result.new, updateBy);

      assert.strictEqual(result.changes?.state?.state, LockState.UNLOCKED);
      assert.strictEqual(result.changes?.state?.originatedAt, date.toISOString());
      assert.strictEqual(result.changes?.state?.createdAt, createdAt.toISOString());
    });

    it("should clone toBeUpdated and have no changes when updateBy is undefined and toBeUpdated is defined", () => {
      const date = new Date(2023, 1, 2);

      const toBeUpdated = new LockState(
        new State<LockStates>(LockState.LOCKED, date),
      );

      const result = updateLockState.run(toBeUpdated, undefined);

      // cloned by value but not the same reference
      assert.deepStrictEqual(result.new, toBeUpdated);
      assert.notStrictEqual(result.new, toBeUpdated);

      assert.strictEqual(result.changes, undefined);
    });
  });
});
