import { describe, it } from "node:test";
import assert from "node:assert/strict";

import CreateUnknown from "../../../model/models/create/CreateUnknown.ts";
import ModelsContext from "../../../../../src/vehicle/dto/vehicleToDto/models/_Context.ts";
import BatteriesDto from "../../../../../src/vehicle/components/energy/BatteriesDto.ts";
import LockStateDto from "../../../../../src/vehicle/components/lock/LockStateDto.ts";
import SpeedometerDto from "../../../../../src/vehicle/components/speedometer/SpeedometerDto.ts";
import OdometerDto from "../../../../../src/vehicle/components/odometer/OdometerDto.ts";
import PositionDto from "../../../../../src/vehicle/components/iot/position/PositionDto.ts";
import NetworkDto from "../../../../../src/vehicle/components/iot/network/NetworkDto.ts";

describe("ToUnknownDto", () => {
  it("converts batteries", async () => {
    const unknown = new CreateUnknown().run();

    const toUnknownDto = new ModelsContext().toUnknownDto();

    const unknownDto = toUnknownDto.run(unknown);

    assert.ok(unknownDto.batteries instanceof BatteriesDto);

    assert.strictEqual(
      unknownDto.batteries?.batteries.length,
      unknown.batteries?.batteries.length,
    );
    assert.strictEqual(
      unknownDto.batteries?.batteries[0].level.state,
      unknown.batteries?.batteries[0].level.state,
    );
    assert.strictEqual(
      unknownDto.batteries?.batteries[0].voltage?.state,
      unknown.batteries?.batteries[0].level.state,
    );
  });

  it("converts position", async () => {
    const unknown = new CreateUnknown().run();

    const toUnknownDto = new ModelsContext().toUnknownDto();

    const unknownDto = toUnknownDto.run(unknown);

    assert.ok(unknownDto.ioT?.position instanceof PositionDto);

    assert.strictEqual(
      unknownDto.ioT?.position.latitude.state,
      unknown.ioT?.position?.latitude.state,
    );
    assert.strictEqual(
      unknownDto.ioT?.position.longitude.state,
      unknown.ioT?.position?.longitude.state,
    );
    assert.strictEqual(
      unknownDto.ioT?.position.accuracy?.state,
      unknown.ioT?.position?.accuracy?.state,
    );
  });

  it("converts network", async () => {
    const unknown = new CreateUnknown().run();

    const toUnknownDto = new ModelsContext().toUnknownDto();

    const unknownDto = toUnknownDto.run(unknown);

    assert.ok(unknownDto.ioT?.network instanceof NetworkDto);

    assert.strictEqual(
      unknownDto.ioT?.network.connectionModules.length,
      unknown.ioT?.network?.connectionModules.length,
    );

    assert.strictEqual(
      unknownDto.ioT?.network.connectionModules[0].state?.state.state,
      unknown.ioT?.network?.connectionModules[0].state?.state.state,
    );
    assert.strictEqual(
      unknownDto.ioT?.network.connectionModules[0].imei,
      unknown.ioT?.network?.connectionModules[0].imei,
    );
    assert.strictEqual(
      unknownDto.ioT?.network.connectionModules[0].detectedProtocol?.state,
      unknown.ioT?.network?.connectionModules[0].detectedProtocol?.state,
    );

    assert.strictEqual(
      unknownDto.ioT?.network.connectionModules[0].detectedProtocolVersion
        ?.state,
      unknown.ioT?.network?.connectionModules[0].detectedProtocolVersion?.state,
    );

    assert.strictEqual(
      unknownDto.ioT?.network.connectionModules[0].setProtocolVersion?.state,
      unknown.ioT?.network?.connectionModules[0].setProtocolVersion?.state,
    );

    assert.strictEqual(
      unknownDto.ioT?.network.connectionModules[0].setProtocol?.state,
      unknown.ioT?.network?.connectionModules[0].setProtocol?.state,
    );
  });

  it("converts lock", async () => {
    const unknown = new CreateUnknown().run();

    const toUnknownDto = new ModelsContext().toUnknownDto();

    const unknownDto = toUnknownDto.run(unknown);

    assert.ok(unknownDto.lock instanceof LockStateDto);

    assert.strictEqual(unknownDto.lock.state.state, unknown.lock?.state?.state.state);
  });

  it("converts odometer", async () => {
    const unknown = new CreateUnknown().run();

    const toUnknownDto = new ModelsContext().toUnknownDto();

    const unknownDto = toUnknownDto.run(unknown);

    assert.ok(unknownDto.odometer instanceof OdometerDto);

    assert.strictEqual(unknownDto.odometer.state.state, unknown.odometer?.state?.state);
  });

  it("converts speedometer", async () => {
    const unknown = new CreateUnknown().run();

    const toUnknownDto = new ModelsContext().toUnknownDto();

    const unknownDto = toUnknownDto.run(unknown);

    assert.ok(unknownDto.speedometer instanceof SpeedometerDto);

    assert.strictEqual(unknownDto.speedometer.state.state, unknown.speedometer?.state?.state);
  });
});
