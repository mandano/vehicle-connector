import { strict as assert } from "assert";
import { after, before, afterEach, describe, it } from "node:test";

import { de, Faker } from "@faker-js/faker";

import ImeiSocketIdValkeyRepository from "../../../src/repositories/imeiSocketId/ImeiSocketIdValkeyRepository.ts";
import ValkeyAdapter from "../../../src/adapters/valkey/ValkeyAdapter.ts";
import FakeLogger from "../../logger/FakeLogger.ts";
import type Imei from "../../../src/vehicle/components/iot/network/protocol/Imei.ts";

describe("ImeiSocketIdValkeyRepository", () => {
  let adapter: ValkeyAdapter;
  let repository: ImeiSocketIdValkeyRepository;
  const faker = new Faker({ locale: [de] });
  const logger = new FakeLogger();

  const host = process.env.VALKEY_HOST || "localhost";
  const port = process.env.VALKEY_PORT
    ? parseInt(process.env.VALKEY_PORT)
    : 6379;

  before(async () => {
    adapter = new ValkeyAdapter(logger, {
      host: host,
      port: port,
      connectionName: "ImeiSocketIdValkeyRepositoryIntegrationTest",
    });
    await adapter.connect();
    repository = new ImeiSocketIdValkeyRepository(adapter, logger);
  });

  after(async () => {
    await adapter.close();
  });

  afterEach(async () => {
    // Clean up after each test
    await repository.deleteAll();
  });

  it("should create an IMEI to socketId mapping", async () => {
    const testImei = faker.phone.imei();
    const testSocketId = faker.string.uuid();

    await repository.create(testImei, testSocketId);

    const socketId = await repository.getSocketIdInImeiKey(testImei);
    assert.equal(
      socketId,
      testSocketId,
      "Should retrieve the correct socketId for the IMEI",
    );

    const imei = await repository.getImeiInSocketIdKey(testSocketId);
    assert.equal(
      imei,
      testImei,
      "Should retrieve the correct IMEI for the socketId",
    );
  });

  it("should delete an IMEI to socketId mapping", async () => {
    const testImei = faker.phone.imei();
    const testSocketId = faker.string.uuid();

    await repository.create(testImei, testSocketId);

    const result = await repository.delete(testImei);
    assert.equal(result, true, "Delete operation should succeed");

    const socketId = await repository.getSocketIdInImeiKey(testImei);
    assert.equal(
      socketId,
      undefined,
      "Should not find a socketId after deletion",
    );

    const imei = await repository.getImeiInSocketIdKey(testSocketId);
    assert.equal(imei, undefined, "Should not find an IMEI after deletion");
  });

  it("should return false when deleting a non-existent IMEI", async () => {
    const result = await repository.delete("999999999999999" as Imei);
    assert.equal(
      result,
      false,
      "Delete operation should return false for non-existent IMEI",
    );
  });

  it("should delete an IMEI to socketId mapping by socketId", async () => {
    const testImei = faker.phone.imei();
    const testSocketId = faker.string.uuid();

    await repository.create(testImei, testSocketId);

    const result = await repository.deleteBySocketId(testSocketId);
    assert.equal(result, true, "Delete by socketId operation should succeed");

    // Verify the mapping was deleted
    const socketId = await repository.getSocketIdInImeiKey(testImei);
    assert.equal(
      socketId,
      undefined,
      "Should not find a socketId after deletion",
    );

    const imei = await repository.getImeiInSocketIdKey(testSocketId);
    assert.equal(imei, undefined, "Should not find an IMEI after deletion");
  });

  it("should return false when deleting by a non-existent socketId", async () => {
    const result = await repository.deleteBySocketId("non-existent-socket");
    assert.equal(
      result,
      false,
      "Delete by socketId operation should return false for non-existent socketId",
    );
  });

  it("should delete all IMEI to socketId mappings", async () => {
    const testImei1 = faker.phone.imei();
    const testSocketId1 = faker.string.uuid();

    const testImei2 = faker.phone.imei();
    const testSocketId2 = faker.string.uuid();

    await repository.create(testImei1, testSocketId1);
    await repository.create(testImei2, testSocketId2);

    const result = await repository.deleteAll();
    assert.equal(result, true, "Delete all operation should succeed");

    const socketId1 = await repository.getSocketIdInImeiKey(testImei1);
    assert.equal(
      socketId1,
      undefined,
      "Should not find socketId1 after deletion",
    );

    const socketId2 = await repository.getSocketIdInImeiKey(testImei2);
    assert.equal(
      socketId2,
      undefined,
      "Should not find socketId2 after deletion",
    );
  });

  it("should return false when deleting all mappings but none exist", async () => {
    await repository.deleteAll();

    const result = await repository.deleteAll();
    assert.equal(
      result,
      false,
      "Delete all operation should return false when no mappings exist",
    );
  });

  it("should handle multiple create operations for the same IMEI", async () => {
    const testImei = faker.phone.imei();
    const testSocketId = faker.string.uuid();

    await repository.create(testImei, testSocketId);

    const newSocketId = "socket-new";
    const result = await repository.create(testImei, newSocketId);
    assert.equal(result, true, "Create operation should succeed");

    const socketId = await repository.getSocketIdInImeiKey(testImei);
    assert.equal(
      socketId,
      newSocketId,
      "Should retrieve the updated socketId for the IMEI",
    );

    const imei = await repository.getImeiInSocketIdKey(testSocketId);
    assert.equal(
      imei,
      undefined,
      "Old socketId should no longer map to the IMEI",
    );
  });

  it("should handle multiple create operations for the same socketId", async () => {
    const testImei = faker.phone.imei();
    const testSocketId = faker.string.uuid();

    await repository.create(testImei, testSocketId);

    const newImei = faker.phone.imei();
    const result = await repository.create(newImei, testSocketId);
    assert.equal(result, true, "Create operation should succeed");

    // Verify the mapping was updated
    const imei = await repository.getImeiInSocketIdKey(testSocketId);
    assert.equal(
      imei,
      newImei,
      "Should retrieve the updated IMEI for the socketId",
    );

    // The old IMEI should no longer map to the socketId
    const socketId = await repository.getSocketIdInImeiKey(testImei);
    assert.equal(
      socketId,
      undefined,
      "Old IMEI should no longer map to the socketId",
    );
  });
});
