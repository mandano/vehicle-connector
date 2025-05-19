import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { Unknown } from "../../src/vehicle/model/models/Unknown.ts";
import { Vehicle } from "../../src/vehicle/Vehicle.ts";
import { IoT } from "../../src/vehicle/components/iot/IoT.ts";

import { CreateNetwork } from "./iot/network/CreateNetwork.ts";

describe("Vehicle", () => {
  it("should create an instance of Vehicle", () => {
    const vehicleId = 1;
    const model = new Unknown(undefined, new IoT(new CreateNetwork().run()));
    const vehicle = new Vehicle(vehicleId, model, new Date());
    assert.strictEqual(vehicle.id, vehicleId);
  });
});
