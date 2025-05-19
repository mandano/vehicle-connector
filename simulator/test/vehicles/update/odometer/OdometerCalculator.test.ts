import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { CreateReservation } from "../../../reservations/CreateReservation.ts";
import { OdometerCalculator } from "../../../../src/vehicles/update/odometer/OdometerCalculator.ts";

describe("EnergyCalculator", () => {
  describe("calcEnergyLossWhileUnlocked", () => {
    it("should calculate energy loss while locked correctly", () => {
      const durationInMilliSec = 30 * 60 * 1000;
      const distance =
        OdometerCalculator.calcDrivenDistanceForIntervalDuringReservation(
          new Date("2023-01-01T00:00:00Z"),
          new Date("2023-01-01T00:15:00Z"),
          new CreateReservation().run({
            startTime: new Date("2022-12-31T23:55:00Z"),
            durationInMilliSec: durationInMilliSec,
            distanceInMeters: 15000,
          }),
        );
      assert.strictEqual(distance, 7500);
    });
  });
});
