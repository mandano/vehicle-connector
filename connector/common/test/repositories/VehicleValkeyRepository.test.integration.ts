import { describe, it, before, beforeEach, after, afterEach } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";

import VehicleValkeyRepository from "../../src/repositories/vehicle/valkey/VehicleValkeyRepository.ts";
import Vehicle from "../../src/vehicle/Vehicle.ts";
import ValkeyAdapter from "../../src/adapters/valkey/ValkeyAdapter.ts";
import FakeLogger from "../logger/FakeLogger.ts";
import CreateUnknown from "../vehicle/model/models/create/CreateUnknown.ts";
import FakeSendActionRequest from "../vehicle/model/actions/FakeSendActionRequest.ts";
import DtoContext from "../../src/vehicle/dto/_Context.ts";
import VehicleDto from "../../src/vehicle/VehicleDto.ts";
import Hashable from "../../src/entities/Hashable.ts";
import LockState from "../../src/vehicle/components/lock/LockState.ts";
import State from "../../src/vehicle/State.ts";
import Lock from "../../src/vehicle/components/lock/Lock.ts";
import LockableScooter from "../../src/vehicle/model/models/LockableScooter.ts";

describe("VehicleValkeyRepository", () => {
  let adapter: ValkeyAdapter;
  let repo: VehicleValkeyRepository;
  const logger = new FakeLogger();
  let dtoContext: DtoContext | undefined;

  before(async () => {
    adapter = new ValkeyAdapter(new FakeLogger(), {
      host: process.env.VALKEY_HOST || "localhost",
      port: process.env.VALKEY_PORT ? parseInt(process.env.VALKEY_PORT) :  6379,
    });
    await adapter.connect();

    dtoContext = new DtoContext(new FakeSendActionRequest());
  });

  after(async () => {
    await adapter.close();
  });

  beforeEach(async () => {
    if (dtoContext === undefined) {
      assert.fail();
    }

    repo = new VehicleValkeyRepository(
      adapter,
      logger,
      dtoContext.objectToDto().objectToDto(),
      dtoContext.dtoToVehicle().dtoToVehicle(),
      dtoContext.vehicleToObject(),
      dtoContext?.dtoToObject()
    );
  });

  afterEach(async () => {
    const keys = await adapter.scan("vehicle:*");
    for (const key of keys) {
      await adapter.del(key);
    }
  });

  it("findById returns Vehicle if present", async () => {
    const unknown = new CreateUnknown().run();
    const vehicle = new Vehicle(1, unknown, new Date());

    const vehicleToObject = dtoContext?.vehicleToObject();
    const vehicleAsObj = vehicleToObject?.run(vehicle);

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicleAsObj))
      .digest("hex");

    const hashable = new Hashable(hash, vehicleAsObj);

    await adapter.set("vehicle:1", {
      hash: hashable.hash,
      value: hashable.value,
    });
    const result = await repo.findById(1);
    assert.deepEqual(result?.value, vehicle);
    assert.equal(hash, result?.hash);
  });

  it("findById returns undefined if not present", async () => {
    const result = await repo.findById(2);
    assert.equal(result, undefined);
  });

  it("findByIdDto returns vehicleDto if present", async () => {
    const unknown = new CreateUnknown().run();
    const vehicle = new Vehicle(1, unknown, new Date());

    const vehicleToDto = dtoContext?.vehicleToDto().vehicleToDto();
    const dtoToObject = dtoContext?.dtoToObject();

    const vehicleDto = vehicleToDto?.run(vehicle);

    if (vehicleDto === undefined) {
      assert.fail();
    }

    const obj = dtoToObject?.run(vehicleDto);

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(obj))
      .digest("hex");

    const hashable = new Hashable(hash, obj);

    await adapter.set("vehicle:1", {
      hash: hashable.hash,
      value: hashable.value,
    });

    const result = await repo.findByIdDto(1);

    assert.deepEqual(result?.value, vehicleDto);
    assert.equal(hash, result?.hash);
  });

  it("findByImei returns Vehicle by IMEI", async () => {
    const unknown = new CreateUnknown().run();
    const id = 1;
    const vehicle = new Vehicle(id, unknown, new Date());
    const imei = vehicle.model.ioT?.network?.getImeiOfFirstConnectionModule();
    if (imei === undefined) {
      assert.fail();
    }

    const vehicleToObject = dtoContext?.vehicleToObject();
    const vehicleAsObj = vehicleToObject?.run(vehicle);

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicleAsObj))
      .digest("hex");

    const hashable = new Hashable(hash, vehicleAsObj);

    await adapter.set(`vehicle:${id}`, {
      hash: hashable.hash,
      value: hashable.value,
    });

    await adapter.set(`vehicle:imei:${imei}`, id);
    const result = await repo.findByImei(imei);
    assert.deepEqual(result?.value, vehicle);
    assert.equal(hash, result?.hash);
  });

  it("findByImei returns undefined if IMEI not found", async () => {
    const result = await repo.findByImei("notfound");
    assert.equal(result, undefined);
  });

  it("findByImeiDto returns VehicleDto", async () => {
    const unknown = new CreateUnknown().run();
    const id = 1;
    const vehicle = new Vehicle(id, unknown, new Date());
    const imei = vehicle.model.ioT?.network?.getImeiOfFirstConnectionModule();
    if (imei === undefined) {
      assert.fail();
    }

    const vehicleToDto = dtoContext?.vehicleToDto().vehicleToDto();
    const dtoToObject = dtoContext?.dtoToObject();

    const vehicleDto = vehicleToDto?.run(vehicle);

    if (vehicleDto === undefined) {
      assert.fail();
    }

    const obj = dtoToObject?.run(vehicleDto);

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(obj))
      .digest("hex");

    const hashable = new Hashable(hash, obj);

    await adapter.set(`vehicle:${id}`, {
      hash: hashable.hash,
      value: hashable.value,
    });
    await adapter.set(`vehicle:imei:${imei}`, id);

    const result = await repo.findByImeiDto(imei);

    assert.deepEqual(result?.value, vehicleDto);
    assert.equal(hash, result?.hash);
  });

  it("findAll returns all Vehicles in range", async () => {
    const unknown = new CreateUnknown().run();
    const vehicle1 = new Vehicle(1, unknown, new Date());
    const vehicle2 = new Vehicle(2, unknown, new Date());
    const vehicle3 = new Vehicle(3, unknown, new Date());

    const vehicleToObject = dtoContext?.vehicleToObject();
    const vehicle1AsObj = vehicleToObject?.run(vehicle1);
    const vehicle2AsObj = vehicleToObject?.run(vehicle2);
    const vehicle3AsObj = vehicleToObject?.run(vehicle3);

    const hashVehicle1 = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicle1AsObj))
      .digest("hex");

    const hashableVehicle1 = new Hashable(hashVehicle1, vehicle1AsObj);

    await adapter.set(`vehicle:${vehicle1.id}`, {
      hash: hashableVehicle1.hash,
      value: hashableVehicle1.value,
    });

    const hashVehicle2 = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicle2AsObj))
      .digest("hex");

    const hashableVehicle2 = new Hashable(hashVehicle2, vehicle2AsObj);

    await adapter.set(`vehicle:${vehicle2.id}`, {
      hash: hashableVehicle2.hash,
      value: hashableVehicle2.value,
    });

    const hashVehicle3 = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicle3AsObj))
      .digest("hex");

    const hashableVehicle3 = new Hashable(hashVehicle3, vehicle3AsObj);

    await adapter.set(`vehicle:${vehicle3.id}`, {
      hash: hashableVehicle3.hash,
      value: hashableVehicle3.value,
    });

    const result = await repo.findAll(1, 2);

    assert.deepEqual(
      result.map((h: Hashable<Vehicle>) => h.value.id),
      [1, 2],
    );
  });

  it("findAllDto returns all VehicleDto's in range", async () => {
    const unknown = new CreateUnknown().run();
    const vehicle1 = new Vehicle(1, unknown, new Date());
    const vehicle2 = new Vehicle(2, unknown, new Date());
    const vehicle3 = new Vehicle(3, unknown, new Date());

    const vehicleToObject = dtoContext?.vehicleToObject();
    const vehicle1AsObj = vehicleToObject?.run(vehicle1);
    const vehicle2AsObj = vehicleToObject?.run(vehicle2);
    const vehicle3AsObj = vehicleToObject?.run(vehicle3);

    const hashVehicle1 = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicle1AsObj))
      .digest("hex");

    const hashableVehicle1 = new Hashable(hashVehicle1, vehicle1AsObj);

    await adapter.set(`vehicle:${vehicle1.id}`, {
      hash: hashableVehicle1.hash,
      value: hashableVehicle1.value,
    });

    const hashVehicle2 = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicle2AsObj))
      .digest("hex");

    const hashableVehicle2 = new Hashable(hashVehicle2, vehicle2AsObj);

    await adapter.set(`vehicle:${vehicle2.id}`, {
      hash: hashableVehicle2.hash,
      value: hashableVehicle2.value,
    });

    const hashVehicle3 = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicle3AsObj))
      .digest("hex");

    const hashableVehicle3 = new Hashable(hashVehicle3, vehicle3AsObj);

    await adapter.set(`vehicle:${vehicle3.id}`, {
      hash: hashableVehicle3.hash,
      value: hashableVehicle3.value,
    });
    const result = await repo.findAllDto(2, 3);
    assert.deepEqual(
      result.map((h: Hashable<VehicleDto>) => h.value.id),
      [2, 3],
    );
  });

  it("creates a vehicle", async () => {
    const unknown = new CreateUnknown().run();

    const created = await repo.create(unknown);
    assert.ok(created);

    const found = await repo.findById(created);
    assert.deepEqual(found?.value.model, unknown);
  });

  it("updates by imei", async () => {
    const unknownOriginal = new CreateUnknown().run({
      lock: new Lock(
        undefined,
        new LockState(new State(LockState.LOCKED)),
      ),
    });
    const id = 1;
    const vehicle = new Vehicle(id, unknownOriginal, new Date());
    const imei = vehicle.model.ioT?.network?.getImeiOfFirstConnectionModule();
    if (imei === undefined) {
      assert.fail();
    }

    const vehicleToObject = dtoContext?.vehicleToObject();
    const vehicleAsObj = vehicleToObject?.run(vehicle);

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicleAsObj))
      .digest("hex");

    const hashable = new Hashable(hash, vehicleAsObj);

    await adapter.set(`vehicle:${id}`, {
      hash: hashable.hash,
      value: hashable.value,
    });
    await adapter.set(`vehicle:imei:${imei}`, id);

    const unknownUpdated = new CreateUnknown().run({
      lock: new Lock(
        undefined,
        new LockState(new State(LockState.UNLOCKED)),
      ),
    });

    const result = await repo.updateByImei(imei, unknownUpdated, hash);
    assert.ok(result);

    const vehicleFound = await repo.findById(id);

    assert.strictEqual(
      vehicleFound?.value.model?.lock?.state?.state.state,
      LockState.UNLOCKED,
    );
    assert.strictEqual(vehicle?.model?.lock?.state?.state.state, LockState.LOCKED);
  });

  it("does not update by imei, hash incorrect", async () => {
    const unknownOriginal = new CreateUnknown().run({
      lock: new Lock(
        undefined,
        new LockState(new State(LockState.LOCKED)),
      ),
    });
    const id = 1;
    const vehicle = new Vehicle(id, unknownOriginal, new Date());
    const imei = vehicle.model.ioT?.network?.getImeiOfFirstConnectionModule();
    if (imei === undefined) {
      assert.fail();
    }

    const vehicleToObject = dtoContext?.vehicleToObject();
    const vehicleAsObj = vehicleToObject?.run(vehicle);

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicleAsObj))
      .digest("hex");

    const hashable = new Hashable(hash, vehicleAsObj);

    await adapter.set(`vehicle:${id}`, {
      hash: hashable.hash,
      value: hashable.value,
    });
    await adapter.set(`vehicle:imei:${imei}`, id);

    const unknownUpdated = new CreateUnknown().run({
      lock: new Lock(
        undefined,
        new LockState(new State(LockState.UNLOCKED)),
      ),
    });

    const result = await repo.updateByImei(imei, unknownUpdated, 'incorrectHash');
    assert.ok(!result);
  });

  it("updates its modelName", async () => {
    const unknownOriginal = new CreateUnknown().run({
      lock: new Lock(
        undefined,
        new LockState(new State(LockState.LOCKED)),
      ),
    });
    const id = 1;
    const vehicle = new Vehicle(id, unknownOriginal, new Date());
    const imei = vehicle.model.ioT?.network?.getImeiOfFirstConnectionModule();
    if (imei === undefined) {
      assert.fail();
    }
    const modelType = "LockableScooter";

    const vehicleToObject = dtoContext?.vehicleToObject();
    const vehicleAsObj = vehicleToObject?.run(vehicle);

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicleAsObj))
      .digest("hex");

    const hashable = new Hashable(hash, vehicleAsObj);

    await adapter.set(`vehicle:${id}`, {
      hash: hashable.hash,
      value: hashable.value,
    });
    await adapter.set(`vehicle:imei:${imei}`, id);

    const result = await repo.updateModelName(id, modelType, hash);
    assert.ok(result);

    const vehicleFound = await repo.findById(id);

    assert.ok(vehicleFound?.value.model instanceof LockableScooter);
  });
});
