import assert from "assert";
import { describe, it } from "node:test";

import Batteries from "../../../../../../../../src/vehicle/components/energy/Batteries.ts";
import UpdateBatteries from "../../../../../../../../src/vehicle/model/builders/update/components/energy/batteries/UpdateBatteries.ts";
import UpdateBattery from "../../../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/UpdateBattery.ts";
import StateToChanges from "../../../../../../../../src/vehicle/model/builders/update/components/state/StateToChanges.ts";
import UpdateStateNoUndefined from "../../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import UpdateVoltage from "../../../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/voltage/UpdateVoltage.ts";
import BatteryToChanges from "../../../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/BatteryToChanges.ts";
import CloneBatteries from "../../../../../../../../src/vehicle/model/builders/update/components/energy/batteries/CloneBatteries.ts";
import CloneBattery from "../../../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/CloneBattery.ts";
import BatteriesToChanges from "../../../../../../../../src/vehicle/model/builders/update/components/energy/batteries/BatteriesToChanges.ts";
import ToBeUpdatedOriginatedAtUndefined from "../../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined from "../../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";

import MakeBattery from "./MakeBattery.ts";

describe("UpdateBatteries", () => {
  const makeBattery = new MakeBattery();
  const updateState = new UpdateStateNoUndefined(
    new ToBeUpdatedOriginatedAtUndefined(),
    new OriginatedAtUndefined(),
    new UpdateNoUndefined(),
  );

  describe("run", () => {
    it("should copy batteries when toBeUpdated is undefined", () => {
      const updateBattery = new UpdateBattery(
        updateState,
        new UpdateVoltage(updateState, new StateToChanges()),
        new BatteryToChanges(),
      );
      const updater = new UpdateBatteries(
        updateBattery,
        new CloneBatteries(new CloneBattery()),
        new BatteriesToChanges(),
      );

      const toBeUpdated = new Batteries([]);
      const srcBatteriesArr = [makeBattery.run(10), makeBattery.run(20)];
      const updateBy = new Batteries(srcBatteriesArr);

      const result = updater.run(toBeUpdated, updateBy);

      // returns same instance of toBeUpdated
      assert.deepStrictEqual(result.new, updateBy);
    });

    it("should update level using UpdateState and keep voltage when updateBy.voltage is undefined", () => {
      const updateBattery = new UpdateBattery(
        updateState,
        new UpdateVoltage(updateState, new StateToChanges()),
        new BatteryToChanges(),
      );
      const updater = new UpdateBatteries(
        updateBattery,
        new CloneBatteries(new CloneBattery()),
        new BatteriesToChanges(),
      );

      const oldDate = new Date(2022, 0, 1);
      const newDate = new Date(2022, 0, 2);

      const toBeUpdated = new Batteries([
        makeBattery.run(50, oldDate, 12, oldDate),
      ]);
      const updateBy = new Batteries([makeBattery.run(60, newDate)]); // no voltage provided

      const result = updater.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.batteries.length, 1);
      // level should be updated to 60
      assert.strictEqual(result.new?.batteries[0].level.state, 60);
      assert.strictEqual(result.new?.batteries[0].level.originatedAt, newDate);
      // voltage should remain 12 (since updateBy had undefined voltage)
      assert.strictEqual(result.new?.batteries[0].voltage?.state, 12);
      assert.strictEqual(
        result.new?.batteries[0].voltage?.originatedAt,
        oldDate,
      );
    });

    it("should create voltage when toBeUpdated.voltage is undefined and updateBy.voltage is defined", () => {
      const updateBattery = new UpdateBattery(
        updateState,
        new UpdateVoltage(updateState, new StateToChanges()),
        new BatteryToChanges(),
      );
      const updater = new UpdateBatteries(
        updateBattery,
        new CloneBatteries(new CloneBattery()),
        new BatteriesToChanges(),
      );

      const levelDate = new Date();
      const voltageDate = new Date();
      const toBeUpdated = new Batteries([makeBattery.run(30)]); // no voltage
      const updateBy = new Batteries([
        makeBattery.run(30, levelDate, 48, voltageDate),
      ]);

      const result = updater.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.batteries.length, 1);
      assert.strictEqual(result.new?.batteries[0].level.state, 30);
      assert.strictEqual(
        result.new?.batteries[0].level.originatedAt,
        levelDate,
      );
      // voltage should be set to 48
      assert.notStrictEqual(result.new?.batteries[0].voltage, undefined);
      assert.strictEqual(result.new?.batteries[0].voltage?.state, 48);
      assert.strictEqual(
        result.new?.batteries[0].voltage?.originatedAt,
        voltageDate,
      );
    });

    it("should process multiple batteries by index", () => {
      const updateBattery = new UpdateBattery(
        updateState,
        new UpdateVoltage(updateState, new StateToChanges()),
        new BatteryToChanges(),
      );
      const updater = new UpdateBatteries(
        updateBattery,
        new CloneBatteries(new CloneBattery()),
        new BatteriesToChanges(),
      );

      const oldDate = new Date(2022, 0, 1);
      const newDate = new Date(2022, 0, 2);

      const toBeUpdated = new Batteries([
        makeBattery.run(10, oldDate, 12, oldDate),
        makeBattery.run(20, newDate, 24, newDate),
      ]);
      const updateBy = new Batteries([
        // first should update (newer level)
        makeBattery.run(15, newDate, 12, oldDate),
        // second should not change level (older); voltage undefined remains
        makeBattery.run(25, oldDate),
      ]);

      const result = updater.run(toBeUpdated, updateBy);

      // First battery level should be updated to 15; voltage should remain 12
      assert.strictEqual(result.new?.batteries[0].level.state, 15);
      assert.strictEqual(result.new?.batteries[0].level.originatedAt, newDate);
      assert.strictEqual(result.new?.batteries[0].voltage?.state, 12);
      assert.strictEqual(
        result.new?.batteries[0].voltage?.originatedAt,
        oldDate,
      );

      // Second battery level should remain 20 (since updateBy originatedAt older)
      assert.strictEqual(result.new?.batteries[1].level.state, 20);
      assert.strictEqual(result.new?.batteries[1].level.originatedAt, newDate);
      // Voltage should stay 24 (updateBy had undefined)
      assert.strictEqual(result.new?.batteries[1].voltage?.state, 24);
      assert.strictEqual(
        result.new?.batteries[1].voltage?.originatedAt,
        newDate,
      );
    });

    it("should keep voltage undefined when both voltages are undefined", () => {
      const updateBattery = new UpdateBattery(
        updateState,
        new UpdateVoltage(updateState, new StateToChanges()),
        new BatteryToChanges(),
      );
      const updater = new UpdateBatteries(
        updateBattery,
        new CloneBatteries(new CloneBattery()),
        new BatteriesToChanges(),
      );

      const toBeUpdated = new Batteries([makeBattery.run(5)]);
      const updateBy = new Batteries([makeBattery.run(6)]);

      const result = updater.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.batteries[0].level.state, 6);
      assert.strictEqual(
        result.new?.batteries[0].level.originatedAt,
        undefined,
      );
      assert.strictEqual(result.new?.batteries[0].voltage, undefined);
    });

    it("should return undefined when both toBeUpdated and updateBy are undefined", () => {
      const updateBattery = new UpdateBattery(
        updateState,
        new UpdateVoltage(updateState, new StateToChanges()),
        new BatteryToChanges(),
      );
      const updater = new UpdateBatteries(
        updateBattery,
        new CloneBatteries(new CloneBattery()),
        new BatteriesToChanges(),
      );

      const result = updater.run(undefined, undefined);

      assert.strictEqual(result.new, undefined);
      assert.strictEqual(result.changes, undefined);
    });

    it("should clone toBeUpdated when updateBy is undefined", () => {
      const updateBattery = new UpdateBattery(
        updateState,
        new UpdateVoltage(updateState, new StateToChanges()),
        new BatteryToChanges(),
      );
      const updater = new UpdateBatteries(
        updateBattery,
        new CloneBatteries(new CloneBattery()),
        new BatteriesToChanges(),
      );

      const toBeUpdated = new Batteries([
        makeBattery.run(40, new Date(2022, 0, 3), 36, new Date(2022, 0, 3)),
      ]);

      const result = updater.run(toBeUpdated, undefined);

      // cloned instance, not the same reference
      assert.notStrictEqual(result.new, toBeUpdated);

      assert.strictEqual(result.new?.batteries.length, 1);
      assert.strictEqual(result.new?.batteries[0].level.state, 40);
      assert.strictEqual(result.new?.batteries[0].voltage?.state, 36);
      // changes should reflect the original toBeUpdated length (via BatteriesToChanges)
      assert.strictEqual(result.changes?.batteries.length, 1);
    });

    it("should handle updateBy having more batteries than toBeUpdated (append)", () => {
      const updateBattery = new UpdateBattery(
        updateState,
        new UpdateVoltage(updateState, new StateToChanges()),
        new BatteryToChanges(),
      );
      const updater = new UpdateBatteries(
        updateBattery,
        new CloneBatteries(new CloneBattery()),
        new BatteriesToChanges(),
      );

      const toBeUpdated = new Batteries([makeBattery.run(10)]);
      const extraLevelDate = new Date(2023, 0, 1);
      const updateBy = new Batteries([
        makeBattery.run(15),
        makeBattery.run(80, extraLevelDate, 52, extraLevelDate),
      ]);

      const result = updater.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.batteries.length, 2);
      // index 0 updated level from 10 -> 15
      assert.strictEqual(result.new?.batteries[0].level.state, 15);
      // index 1 was appended from updateBy
      assert.strictEqual(result.new?.batteries[1].level.state, 80);
      assert.strictEqual(result.new?.batteries[1].voltage?.state, 52);
    });

    it("should handle updateBy having more batteries than toBeUpdated (append), check changes", () => {
      const updateBattery = new UpdateBattery(
        updateState,
        new UpdateVoltage(updateState, new StateToChanges()),
        new BatteryToChanges(),
      );
      const updater = new UpdateBatteries(
        updateBattery,
        new CloneBatteries(new CloneBattery()),
        new BatteriesToChanges(),
      );

      const toBeUpdated = new Batteries([
        makeBattery.run(10, new Date(2022, 0, 1)),
      ]);
      const updateBy = new Batteries([
        makeBattery.run(15, new Date(2023, 0, 1)),
        makeBattery.run(80, new Date(2023, 0, 1), 52, new Date(2023, 0, 1)),
      ]);

      const result = updater.run(toBeUpdated, updateBy);

      assert.strictEqual(result.changes?.batteries.length, 2);
      assert.strictEqual(
        result.changes?.batteries.find((x) => x.idx === 0)?.batteryChanges
          ?.level?.state,
        15,
      );
      assert.strictEqual(
        result.changes?.batteries.find((x) => x.idx === 1)?.batteryChanges
          ?.level?.state,
        80,
      );
      assert.strictEqual(
        result.changes?.batteries.find((x) => x.idx === 1)?.batteryChanges
          ?.voltage?.state,
        52,
      );
    });

    it("should ignore extra toBeUpdated batteries when updateBy is shorter (unchanged tail)", () => {
      const updateBattery = new UpdateBattery(
        updateState,
        new UpdateVoltage(updateState, new StateToChanges()),
        new BatteryToChanges(),
      );
      const updater = new UpdateBatteries(
        updateBattery,
        new CloneBatteries(new CloneBattery()),
        new BatteriesToChanges(),
      );

      const toBeUpdated = new Batteries([
        makeBattery.run(5, new Date(2020, 0, 1), 12, new Date(2020, 0, 1)),
        makeBattery.run(25, new Date(2020, 0, 2), 24, new Date(2020, 0, 2)),
      ]);
      const updateBy = new Batteries([
        makeBattery.run(30, new Date(2021, 0, 1)),
      ]);

      const result = updater.run(toBeUpdated, updateBy);

      assert.strictEqual(result.new?.batteries.length, 2);
      // index 0 updated
      assert.strictEqual(result.new?.batteries[0].level.state, 30);
      // index 1 remains unchanged
      assert.strictEqual(result.new?.batteries[1].level.state, 25);
      assert.strictEqual(result.new?.batteries[1].voltage?.state, 24);
    });
  });

  it("should ignore extra toBeUpdated batteries when updateBy is shorter (unchanged tail), check changes", () => {
    const updateBattery = new UpdateBattery(
      updateState,
      new UpdateVoltage(updateState, new StateToChanges()),
      new BatteryToChanges(),
    );
    const updater = new UpdateBatteries(
      updateBattery,
      new CloneBatteries(new CloneBattery()),
      new BatteriesToChanges(),
    );

    const toBeUpdated = new Batteries([
      makeBattery.run(5, new Date(2020, 0, 1), 12, new Date(2020, 0, 1)),
      makeBattery.run(25, new Date(2020, 0, 2), 24, new Date(2020, 0, 2)),
    ]);
    const updateBy = new Batteries([makeBattery.run(30, new Date(2021, 0, 1))]);

    const result = updater.run(toBeUpdated, updateBy);

    assert.strictEqual(result.changes?.batteries.length, 1);
  });
});
