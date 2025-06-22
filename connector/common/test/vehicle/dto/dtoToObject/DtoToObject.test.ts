import { describe, it } from "node:test";
import assert from "node:assert/strict";

import DtoToObject from "../../../../src/vehicle/dto/dtoToObject/DtoToObject.ts";
import VehicleDto from "../../../../src/vehicle/VehicleDto.ts";
import UnknownDto from "../../../../src/vehicle/model/models/UnknownDto.ts";
import LockableScooterDto from "../../../../src/vehicle/model/models/LockableScooterDto.ts";
import LockStateDto from "../../../../src/vehicle/components/lock/LockStateDto.ts";
import StateDto from "../../../../src/vehicle/components/state/StateDto.js";
import LockState from "../../../../src/vehicle/components/lock/LockState.js";

describe("DtoToObject", () => {
  it("converts VehicleDto with UnknownDto to object", async () => {
    const unknownDto = new UnknownDto();
    const vehicleDto = new VehicleDto(1, unknownDto, "2023-01-01T00:00:00Z");
    const dtoToObject = new DtoToObject();

    const result = dtoToObject.run(vehicleDto);

    assert.deepStrictEqual(result, {
      id: vehicleDto.id,
      model: {
        ...unknownDto,
        modelName: "Unknown",
      },
      createdAt: vehicleDto.createdAt,
    });
  });

  it("converts VehicleDto with LockableScooterDto to object", async () => {
    const lockStateDto = new LockStateDto(
      new StateDto(
        LockState.LOCKED,
        new Date().toISOString(),
        new Date().toISOString(),
        undefined,
      ),
    );
    const lockableScooterDto = new LockableScooterDto(lockStateDto);
    const vehicleDto = new VehicleDto(
      2,
      lockableScooterDto,
      "2023-01-02T00:00:00Z",
    );
    const dtoToObject = new DtoToObject();

    const result = dtoToObject.run(vehicleDto);

    assert.deepStrictEqual(result, {
      id: vehicleDto.id,
      model: {
        ...lockableScooterDto,
        modelName: "LockableScooter",
      },
      createdAt: vehicleDto.createdAt,
    });
  });

  it("sets lock state", async () => {
    const lockStateDto = new LockStateDto(
      new StateDto(
        LockState.LOCKED,
        new Date().toISOString(),
        new Date().toISOString(),
        undefined,
      ),
    );
    const lockableScooterDto = new LockableScooterDto(lockStateDto);
    const vehicleDto = new VehicleDto(
      3,
      lockableScooterDto,
      "2023-01-03T00:00:00Z",
    );
    const dtoToObject = new DtoToObject();

    const result = dtoToObject.run(vehicleDto);

    if (!("model" in result)) {
      assert.fail();
    }

    if (
      typeof result.model !== "object" ||
      result.model === null ||
      !("lock" in result.model)
    ) {
      assert.fail();
    }

    if (
      typeof result.model.lock !== "object" ||
      result.model.lock === null ||
      !("state" in result.model.lock)
    ) {
      assert.fail();
    }

    if (
      typeof result.model.lock.state !== "object" ||
      result.model.lock.state === null ||
      !("state" in result.model.lock.state)
    ) {
      assert.fail();
    }

    assert.strictEqual(
      result.model.lock.state.state,
      vehicleDto.model.lock?.state.state,
    );
  });
});
