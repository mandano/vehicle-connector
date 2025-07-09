import { describe, it, before, beforeEach, after, afterEach } from "node:test";
import assert from "node:assert/strict";

import OrphanedSocketValkeyRepository from "../../../src/repositories/orphanedSocket/OrphanedSocketValkeyRepository.ts";
import OrphanedSocket from "../../../src/entities/OrphanedSocket.ts";
import ValkeyAdapter from "../../../src/adapters/valkey/ValkeyAdapter.ts";
import FakeLogger from "../../logger/FakeLogger.ts";
import FakeSocket from "../../socket/FakeSocket.ts";

describe("OrphanedSocketValkeyRepository", () => {
  let adapter: ValkeyAdapter;
  let repo: OrphanedSocketValkeyRepository;
  const logger = new FakeLogger();

  before(async () => {
    adapter = new ValkeyAdapter(new FakeLogger(), {
      host: process.env.VALKEY_HOST || "localhost",
      port: process.env.VALKEY_PORT ? parseInt(process.env.VALKEY_PORT) : 6379,
    });
    await adapter.connect();
  });

  after(async () => {
    await adapter.close();
  });

  beforeEach(async () => {
    repo = new OrphanedSocketValkeyRepository(adapter, logger);
  });

  afterEach(async () => {
    await repo.deleteAll();
  });

  it("create returns true when socket is successfully created", async () => {
    const socket = new OrphanedSocket("test-id", "127.0.0.1", "test-app", new Date());
    const result = await repo.create(socket);
    assert.strictEqual(result, true);
  });

  it("createBySocket returns true when socket is successfully created", async () => {
    const fakeSocket = new FakeSocket("127.0.0.1");
    const socketId = "test-socket-id";
    const appName = "test-app";

    const result = await repo.createBySocket(fakeSocket, socketId, appName);
    assert.strictEqual(result, true);
  });

  it("findById returns the socket when it exists", async () => {
    const now = new Date();
    const socket = new OrphanedSocket("test-id", "127.0.0.1", "test-app", now);
    await repo.create(socket);

    const result = await repo.findById("test-id");
    assert.notEqual(result, undefined);
    assert.strictEqual(result?.id, "test-id");
    assert.strictEqual(result?.ip, "127.0.0.1");
    assert.strictEqual(result?.applicationName, "test-app");
    assert.deepEqual(result?.createdAt, now);
  });

  it("findById returns undefined when socket does not exist", async () => {
    const result = await repo.findById("non-existent-id");
    assert.strictEqual(result, undefined);
  });

  it("delete returns true when socket is successfully deleted", async () => {
    const socket = new OrphanedSocket("test-id", "127.0.0.1", "test-app", new Date());
    await repo.create(socket);

    const result = await repo.delete("test-id");
    assert.strictEqual(result, true);

    const findResult = await repo.findById("test-id");
    assert.strictEqual(findResult, undefined);
  });

  it("delete returns false when socket does not exist", async () => {
    const result = await repo.delete("non-existent-id");
    assert.strictEqual(result, false);
  });

  it("getAll returns all sockets", async () => {
    const socket1 = new OrphanedSocket("test-id-1", "127.0.0.1", "test-app-1", new Date());
    const socket2 = new OrphanedSocket("test-id-2", "127.0.0.2", "test-app-2", new Date());

    await repo.create(socket1);
    await repo.create(socket2);

    const result = await repo.getAll();
    assert.notEqual(result, undefined);
    assert.strictEqual(result?.length, 2);

    const sortedResult = result?.sort((a, b) => a.id.localeCompare(b.id));

    assert.strictEqual(sortedResult?.[0].id, "test-id-1");
    assert.strictEqual(sortedResult?.[0].ip, "127.0.0.1");
    assert.strictEqual(sortedResult?.[0].applicationName, "test-app-1");

    assert.strictEqual(sortedResult?.[1].id, "test-id-2");
    assert.strictEqual(sortedResult?.[1].ip, "127.0.0.2");
    assert.strictEqual(sortedResult?.[1].applicationName, "test-app-2");
  });

  it("getAll returns empty array when no sockets exist", async () => {
    await repo.deleteAll();

    const result = await repo.getAll();
    assert.notEqual(result, undefined);
    assert.strictEqual(result?.length, 0);
  });

  it("deleteAll returns true when sockets are successfully deleted", async () => {
    const socket1 = new OrphanedSocket("test-id-1", "127.0.0.1", "test-app-1", new Date());
    const socket2 = new OrphanedSocket("test-id-2", "127.0.0.2", "test-app-2", new Date());

    await repo.create(socket1);
    await repo.create(socket2);

    const result = await repo.deleteAll();
    assert.strictEqual(result, true);

    const getAllResult = await repo.getAll();
    assert.notEqual(getAllResult, undefined);
    assert.strictEqual(getAllResult?.length, 0);
  });

  it("deleteAll returns false when no sockets exist", async () => {
    await repo.deleteAll();

    const result = await repo.deleteAll();
    assert.strictEqual(result, false);
  });

  it("deleteBySocketId returns true when socket is successfully deleted", async () => {
    const socket = new OrphanedSocket("test-id", "127.0.0.1", "test-app", new Date());
    await repo.create(socket);

    const result = await repo.deleteBySocketId("test-id");
    assert.strictEqual(result, true);

    const findResult = await repo.findById("test-id");
    assert.strictEqual(findResult, undefined);
  });
});