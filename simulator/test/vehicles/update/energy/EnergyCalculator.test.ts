import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { EnergyCalculator } from "../../../../src/vehicles/update/energy/EnergyCalculator.ts";
import { CreateReservation } from "../../../reservations/CreateReservation.ts";

describe("EnergyCalculator", () => {
  describe("calcEnergyLossWhileLocked", () => {
    it("should calculate energy loss while locked correctly", () => {
      const secondsSinceLastUpdate = 86400; // 24 hours
      const expectedEnergyLoss = 0.07; // 7% energy loss
      const energyLoss = EnergyCalculator.calcEnergyLossWhileLocked(
        secondsSinceLastUpdate,
      );

      assert.ok(
        Math.abs(energyLoss - expectedEnergyLoss) < 0.00001,
        `Value should about about the same: ${energyLoss} vs ${expectedEnergyLoss}`
      );
    });
  });

  describe("calcEnergyLossWhileUnlocked", () => {
    it("should calculate energy loss while unlocked correctly", () => {
      const startReservation = new Date("2023-01-01T05:00:00Z");
      const durationInMilliSec = 10 * 60 * 1000;
      const start = new Date("2023-01-01T05:01:00Z");
      const end = new Date("2023-01-01T05:04:00Z");
      const reservationDistance = 1000;

      const reservation = new CreateReservation().run({
        startTime: startReservation,
        durationInMilliSec: durationInMilliSec,
        distanceInMeters: reservationDistance,
      });
      const expectedEnergyLoss =
        (3 / 10) *
        reservationDistance *
        EnergyCalculator.energyLossPerMeterInPercentageWhileUnlocked;
      const energyLoss =
        EnergyCalculator.calcEnergyLossWhileInSimulatedReservation(
          start,
          end,
          reservation,
        );

      assert.ok(
        Math.abs(energyLoss - expectedEnergyLoss) < 0.00001,
        `Value should about about the same: ${energyLoss} vs ${expectedEnergyLoss}`
      );
    });
  });
});