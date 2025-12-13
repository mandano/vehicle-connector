import assert from "assert";
import { before, describe, it } from "node:test";

import State from "../../../../../../../src/vehicle/State.ts";
import Speedometer from "../../../../../../../src/vehicle/components/speedometer/Speedometer.ts";
import UpdateStateNoUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import StateToChanges from "../../../../../../../src/vehicle/model/builders/update/components/state/StateToChanges.ts";
import CloneState from "../../../../../../../src/vehicle/model/CloneState.ts";
import UpdateSpeedometer from "../../../../../../../src/vehicle/model/builders/update/components/speedometer/UpdateSpeedometer.ts";
import ToBeUpdatedOriginatedAtUndefined
  from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined
  from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";

describe("UpdateSpeedometer", () => {
  let updateSpeedometer: UpdateSpeedometer;
  let updateState: UpdateStateNoUndefined;

  before(() => {
    updateState = new UpdateStateNoUndefined(
      new ToBeUpdatedOriginatedAtUndefined(),
      new OriginatedAtUndefined(),
      new UpdateNoUndefined(),
    );
    updateSpeedometer = new UpdateSpeedometer(
      updateState,
      new StateToChanges(),
      new CloneState<number>()
    );
  });

  describe("run", () => {
    it("should return undefineds when both inputs are undefined", () => {
      const result = updateSpeedometer.run(undefined, undefined);
      assert.strictEqual(result.new, undefined);
      assert.strictEqual(result.changes, undefined);
    });

    it("should clone updateBy and return changes when toBeUpdated is undefined", () => {
      const originatedAt = new Date(2023, 5, 1);
      const updateBy = new Speedometer(new State<number>(30, originatedAt));

      const result = updateSpeedometer.run(undefined, updateBy);

      assert.notStrictEqual(result.new, updateBy);
      assert.strictEqual(result.new?.state.state, 30);
      assert.strictEqual(result.new?.state.originatedAt, originatedAt);
      assert.strictEqual(result.changes?.state, 30);
      assert.strictEqual(result.changes?.originatedAt, originatedAt.toISOString());
      assert.ok(result.changes?.createdAt);
    });

    it("should clone toBeUpdated and return undefined changes when updateBy is undefined", () => {
      const originatedAt = new Date(2023, 5, 1);
      const toBeUpdated = new Speedometer(new State<number>(15, originatedAt));

      const result = updateSpeedometer.run(toBeUpdated, undefined);

      assert.notStrictEqual(result.new, toBeUpdated);
      assert.strictEqual(result.new?.state.state, 15);
      assert.strictEqual(result.new?.state.originatedAt, originatedAt);
      assert.strictEqual(result.changes, undefined);
    });

    it("should update speedometer when updateBy has newer originatedAt", () => {
      const oldDate = new Date(2022, 1, 1);
      const newDate = new Date(2022, 1, 2);
      
      const toBeUpdated = new Speedometer(new State<number>(10, oldDate));
      const updateBy = new Speedometer(new State<number>(20, newDate));

      const result = updateSpeedometer.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.state.state, 20);
      assert.strictEqual(result.new?.state.originatedAt, newDate);
      assert.notStrictEqual(result.new, updateBy);
      
      assert.notStrictEqual(result.changes, undefined);
      assert.strictEqual(result.changes?.state, 20);
      assert.strictEqual(result.changes?.originatedAt, newDate.toISOString());
    });

    it("should not update speedometer when updateBy has older originatedAt", () => {
      const oldDate = new Date(2022, 1, 1);
      const newDate = new Date(2022, 1, 2);
      
      const toBeUpdated = new Speedometer(new State<number>(10, newDate));
      const updateBy = new Speedometer(new State<number>(20, oldDate));

      const result = updateSpeedometer.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.state.state, 10);
      assert.strictEqual(result.new?.state.originatedAt, newDate);
      assert.notStrictEqual(result.new, toBeUpdated);
      
      assert.strictEqual(result.changes, undefined);
    });

    it("should update speedometer when toBeUpdated has undefined originatedAt and updateBy has defined originatedAt", () => {
      const newDate = new Date();
      
      const toBeUpdated = new Speedometer(new State<number>(10, undefined));
      const updateBy = new Speedometer(new State<number>(20, newDate));

      const result = updateSpeedometer.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.state.state, 20);
      assert.strictEqual(result.new?.state.originatedAt, newDate);
      assert.notStrictEqual(result.new, updateBy);
      
      assert.strictEqual(result.changes?.state, 20);
      assert.strictEqual(result.changes?.originatedAt, newDate.toISOString());
    });

    it("should not update speedometer when toBeUpdated has defined originatedAt and updateBy has undefined originatedAt", () => {
      const oldDate = new Date();
      
      const toBeUpdated = new Speedometer(new State<number>(10, oldDate));
      const updateBy = new Speedometer(new State<number>(20, undefined));

      const result = updateSpeedometer.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.state.state, 10);
      assert.strictEqual(result.new?.state.originatedAt, oldDate);
      assert.notStrictEqual(result.new, toBeUpdated);
      
      assert.strictEqual(result.changes, undefined);
    });

    it("should update speedometer when both originatedAt are undefined", () => {
      const toBeUpdated = new Speedometer(new State<number>(10, undefined));
      const updateBy = new Speedometer(new State<number>(20, undefined));

      const result = updateSpeedometer.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.state.state, 20);
      assert.strictEqual(result.new?.state.originatedAt, undefined);
      assert.notStrictEqual(result.new, updateBy);
      
      assert.strictEqual(result.changes?.state, 20);
      assert.notStrictEqual(result.changes?.updatedAt, undefined);
    });

    it("should not update speedometer when both originatedAt are equal", () => {
      const date = new Date(2022, 1, 1);
      
      const toBeUpdated = new Speedometer(new State<number>(10, date));
      const updateBy = new Speedometer(new State<number>(20, date));

      const result = updateSpeedometer.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.state.state, 10);
      assert.strictEqual(result.new?.state.originatedAt, date);
      assert.notStrictEqual(result.new, toBeUpdated);
      
      assert.strictEqual(result.changes, undefined);
    });
  });
});