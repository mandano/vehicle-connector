import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { Battery } from "../../../../src/vehicle/components/energy/Battery.ts";
import { Batteries } from "../../../../src/vehicle/components/energy/Batteries.ts";
import { State } from "../../../../src/vehicle/State.ts";

describe("Energy", () => {
  describe("latestOriginateAt", () => {
    it("should return undefined if no batteries have originatedAt defined", () => {
      const batteries: Battery[] = [
        new Battery(new State(50)),
        new Battery(new State(75)),
      ];
      const energy = new Batteries(batteries);
      assert.strictEqual(energy.latestOriginateAt(), undefined);
    });

    it("should return the latest originatedAt date", () => {
      const date1 = new Date("2023-01-01T00:00:00Z");
      const date2 = new Date("2023-02-01T00:00:00Z");
      const batteries: Battery[] = [
        new Battery(new State(50, date1)),
        new Battery(new State(75, date2)),
      ];

      const energy = new Batteries(batteries);
      assert.deepStrictEqual(energy.latestOriginateAt(), date2);
    });

    it("will return originatedAt, even though not all batteries have originatedAt set", () => {
      const date1 = new Date("2023-01-01T00:00:00Z");
      const batteries: Battery[] = [
        new Battery(new State(50, date1)),
        new Battery(new State(75)),
      ];
      const energy = new Batteries(batteries);
      assert.deepStrictEqual(energy.latestOriginateAt(), date1);
    });

    it("should return undefined if batteries array is empty", () => {
      const batteries: Battery[] = [];
      const energy = new Batteries(batteries);
      assert.strictEqual(energy.latestOriginateAt(), undefined);
    });
  });
});
