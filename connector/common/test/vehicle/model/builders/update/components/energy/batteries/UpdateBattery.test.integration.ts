import assert from "assert";
import { describe, it } from "node:test";

import UpdateStateNoUndefined from "../../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import UpdateVoltage from "../../../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/voltage/UpdateVoltage.ts";
import StateToChanges from "../../../../../../../../src/vehicle/model/builders/update/components/state/StateToChanges.ts";
import BatteryToChanges from "../../../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/BatteryToChanges.ts";
import UpdateBattery from "../../../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/UpdateBattery.ts";
import ToBeUpdatedOriginatedAtUndefined from "../../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined from "../../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";

import MakeBattery from "./MakeBattery.ts";

describe("UpdateBattery", () => {
  const updateState = new UpdateStateNoUndefined(
    new ToBeUpdatedOriginatedAtUndefined(),
    new OriginatedAtUndefined(),
    new UpdateNoUndefined(),
  );
  const updateVoltage = new UpdateVoltage(updateState, new StateToChanges());
  const batteryToChanges = new BatteryToChanges();
  const updater = new UpdateBattery(
    updateState,
    updateVoltage,
    batteryToChanges,
  );

  describe("run", () => {
    it("returns updateBy and its changes when toBeUpdated is undefined", () => {
      const levelDate = new Date(2023, 0, 1);
      const voltageDate = new Date(2023, 0, 2);
      const updateBy = new MakeBattery().run(80, levelDate, 48, voltageDate);

      const result = updater.run(undefined, updateBy);

      assert.strictEqual(result.new, updateBy);
    });

    it("returns updateBy changes and its changes when toBeUpdated is undefined", () => {
      const levelDate = new Date(2023, 0, 1);
      const voltageDate = new Date(2023, 0, 2);
      const updateBy = new MakeBattery().run(80, levelDate, 48, voltageDate);

      const result = updater.run(undefined, updateBy);

      const expectedChanges = batteryToChanges.run(updateBy);
      assert.deepStrictEqual(result.changes, expectedChanges);
    });

    it("updates level via UpdateState", () => {
      const oldDate = new Date(2022, 0, 1);
      const newDate = new Date(2022, 0, 2);

      const toBeUpdated = new MakeBattery().run(50, oldDate, 12, oldDate);
      const updateBy = new MakeBattery().run(60, newDate);

      const result = updater.run(toBeUpdated, updateBy);

      assert.notStrictEqual(result.new, toBeUpdated);
      assert.notStrictEqual(result.new, updateBy);

      // level should be updated to 60 with new originatedAt
      assert.strictEqual(result.new.level.state, 60);
      assert.strictEqual(result.new.level.originatedAt, newDate);
      assert.strictEqual(
        result.new.level.createdAt,
        toBeUpdated.level.createdAt,
      );
    });

    it("updates level via UpdateState and return changes", () => {
      const oldDate = new Date(2022, 0, 1);
      const newDate = new Date(2022, 0, 2);

      const toBeUpdated = new MakeBattery().run(50, oldDate, 12, oldDate);
      const updateBy = new MakeBattery().run(60, newDate);

      const result = updater.run(toBeUpdated, updateBy);

      assert.strictEqual(result.changes?.level?.state, updateBy.level.state);
      assert.strictEqual(
        result.changes?.level.originatedAt,
        updateBy.level.originatedAt?.toISOString(),
      );
      assert.ok(result.changes?.level?.updatedAt);
    });

    it("updates level via UpdateState and does not influence voltage", () => {
      const oldDate = new Date(2022, 0, 1);
      const newDate = new Date(2022, 0, 2);

      const toBeUpdated = new MakeBattery().run(50, oldDate, 12, oldDate);
      const updateBy = new MakeBattery().run(60, newDate); // no voltage provided

      const result = updater.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new.voltage?.state, 12);
      assert.strictEqual(result.new.voltage?.originatedAt, oldDate);
    });

    it("creates voltage when toBeUpdated.voltage is undefined", () => {
      const levelDate = new Date(2024, 5, 1);
      const voltageDate = new Date(2024, 5, 2);

      const toBeUpdated = new MakeBattery().run(30, levelDate);
      const updateBy = new MakeBattery().run(30, levelDate, 54, voltageDate);

      const result = updater.run(toBeUpdated, updateBy);

      assert.notStrictEqual(result.new.voltage, undefined);
      assert.strictEqual(result.new.voltage?.state, updateBy.voltage?.state);
      assert.strictEqual(
        result.new.voltage?.originatedAt,
        updateBy.voltage?.originatedAt,
      );
    });

    it("creates voltage when toBeUpdated.voltage is undefined and returns changes", () => {
      const levelDate = new Date(2024, 5, 1);
      const voltageDate = new Date(2024, 5, 2);

      const toBeUpdated = new MakeBattery().run(30, levelDate);
      const updateBy = new MakeBattery().run(30, levelDate, 54, voltageDate);

      const result = updater.run(toBeUpdated, updateBy);

      assert.strictEqual(
        result.changes?.voltage?.state,
        updateBy.voltage?.state,
      );
      assert.strictEqual(
        result.changes?.voltage?.originatedAt,
        updateBy.voltage?.originatedAt?.toISOString(),
      );
      assert.strictEqual(
        result.changes?.voltage?.createdAt,
        updateBy.voltage?.createdAt?.toISOString(),
      );
    });

    it("updates voltage", () => {
      const oldDate = new Date(2024, 5, 1);
      const newDate = new Date(2024, 5, 2);

      const toBeUpdated = new MakeBattery().run(30, oldDate, 34, oldDate);
      const updateBy = new MakeBattery().run(30, oldDate, 54, newDate);

      const result = updater.run(toBeUpdated, updateBy);

      assert.notStrictEqual(result.new.voltage, undefined);
      assert.strictEqual(result.new.voltage?.state, updateBy.voltage?.state);
      assert.strictEqual(
        result.new.voltage?.originatedAt,
        updateBy.voltage?.originatedAt,
      );
    });

    it("updates voltage and returns changes", () => {
      const oldDate = new Date(2024, 5, 1);
      const newDate = new Date(2024, 5, 2);

      const toBeUpdated = new MakeBattery().run(30, oldDate, 34, oldDate);
      const updateBy = new MakeBattery().run(30, oldDate, 54, newDate);

      const result = updater.run(toBeUpdated, updateBy);

      assert.strictEqual(
        result.changes?.voltage?.state,
        updateBy.voltage?.state,
      );
      assert.strictEqual(
        result.changes?.voltage?.originatedAt,
        updateBy.voltage?.originatedAt?.toISOString(),
      );
      assert.ok(result.changes?.voltage?.updatedAt);
    });
  });
});
