import { strict as assert } from "assert";
import { after, before, describe, it } from "node:test";

import ValkeyAdapter from "../../../src/adapters/valkey/ValkeyAdapter.ts";
import ValkeyAdapterOptions from "../../../src/adapters/valkey/ValkeyAdapterOptions.ts";
import LoggerInterface from "../../../src/logger/LoggerInterface.ts";
import FakeLogger from "../../logger/FakeLogger.ts";

describe("ValkeyAdapter", () => {
  let adapter: ValkeyAdapter;
  let logger: LoggerInterface;
  const testKey = "test:key";
  const testValue = { foo: "bar" };
  const pattern = "test:*";

  const host = process.env.VALKEY_HOST || "localhost";
  const port = process.env.VALKEY_PORT ? parseInt(process.env.VALKEY_PORT) :  6379;

  before(async () => {
    logger = new FakeLogger();
    const options: ValkeyAdapterOptions = {
      host: host,
      port: port,
      connectionName: "ValkeyAdapterIntegrationTest",
    };
    adapter = new ValkeyAdapter(logger, options);
    await adapter.connect();
  });

  after(async () => {
    await adapter.del(testKey);
    await adapter.close();
  });

  it("should set and get a value", async () => {
    const setResult = await adapter.set(testKey, testValue);
    assert.equal(setResult, true);
    const getResult = await adapter.get(testKey);
    assert.deepEqual(getResult, testValue);
  });

  it("should delete a value", async () => {
    await adapter.set(testKey, testValue);
    const delResult = await adapter.del(testKey);
    assert.equal(delResult, true);
    const getResult = await adapter.get(testKey);
    assert.equal(getResult, undefined);
  });

  it("should scan for keys", async () => {
    await adapter.set(testKey, testValue);
    const keys = await adapter.scan(pattern);
    assert.ok(keys.includes(testKey));
    await adapter.del(testKey);
  });

  it("should delete multiple keys at once", async () => {
    const testKey1 = "test:key1";
    const testKey2 = "test:key2";
    const testKey3 = "test:key3";
    const testKeys = [testKey1, testKey2, testKey3];

    await adapter.set(testKey1, testValue);
    await adapter.set(testKey2, testValue);
    await adapter.set(testKey3, testValue);

    const delResult = await adapter.multiDel(testKeys);
    assert.equal(delResult, true);

    const getResult1 = await adapter.get(testKey1);
    const getResult2 = await adapter.get(testKey2);
    const getResult3 = await adapter.get(testKey3);

    assert.equal(getResult1, undefined);
    assert.equal(getResult2, undefined);
    assert.equal(getResult3, undefined);
  });
});
