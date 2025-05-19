import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { FakeLogger } from "../../../logger/FakeLogger.ts";
import { RabbitMqConnection } from "../../../../src/adapters/queue/rabbitMq/RabbitMqConnection.ts";

describe("RabbitMq", () => {
  let rabbitMq: RabbitMqConnection;
  let logger: FakeLogger;

  const port = process.env.RABBITMQ_PORT || "5672";
  const user = process.env.RABBITMQ_USER || "user";
  const password = process.env.RABBITMQ_PASSWORD || "password";
  const host = process.env.RABBITMQ_HOST || "localhost";

  const dsn = `amqp://${user}:${password}@${host}:${port}`;
  beforeEach(() => {
    logger = new FakeLogger();

  });

  it("should initialize and connect successfully", async () => {
    rabbitMq = new RabbitMqConnection(dsn, logger, false);

    const result = await rabbitMq.init();

    assert.strictEqual(result, true);

    await rabbitMq.close();
  });

  it("should fail connecting", async () => {
    const retry = false;
    rabbitMq = new RabbitMqConnection("amqp://unknownHost", logger, retry);

    const result = await rabbitMq.init();

    assert.strictEqual(result, false);
  });

  it("should fail connecting, retrying and connecting successfully", { timeout: 10000}, async () => {
    const retry = true;

    rabbitMq = new RabbitMqConnection("amqp://unknown", logger, retry, 1000, 5000);

    const resultFirstAttempt = await rabbitMq.init();
    assert.strictEqual(resultFirstAttempt, false);
    assert.strictEqual(rabbitMq.connected, false)
    // difference between pipeline and local error, therefore commented out
    // assert.ok(logger.loggedMessages.includes("error: Connection error: EAI_AGAIN, using amqp://unknownRabbitMqConnection"));
    assert.strictEqual(logger.loggedMessages.includes("error: Retrying connecting.RabbitMqConnection"), true);

    rabbitMq.url = dsn;

    const resultSecondAttempt = await rabbitMq.init();
    assert.strictEqual(resultSecondAttempt, true);

    await rabbitMq.close();
  });

  it("should handle connection close event", async () => {
    rabbitMq = new RabbitMqConnection(dsn, logger, false);

    await rabbitMq.init();

    rabbitMq.connection()?.emit(RabbitMqConnection.EVENT_CLOSE);
    await rabbitMq.close();

    assert.ok(logger.loggedMessages.includes("error: Connection closedRabbitMqConnection"));
  });

  it("should handle connection error event", async () => {
    rabbitMq = new RabbitMqConnection(dsn, logger, false);

    await rabbitMq.init();

    rabbitMq.connection()?.emit(RabbitMqConnection.EVENT_ERROR);

    assert.ok(logger.loggedMessages.includes("error: Connection error: undefinedRabbitMqConnection"));
    await rabbitMq.close();
  });

  it("init again after connection close event", async () => {
    rabbitMq = new RabbitMqConnection(dsn, logger, false);

    await rabbitMq.init();

    rabbitMq.connection()?.emit(RabbitMqConnection.EVENT_CLOSE);
    await rabbitMq.close();

    const result = await rabbitMq.init();

    assert.strictEqual(result, true);

    await rabbitMq.close();
  });

  it("can create channel", async () => {
    rabbitMq = new RabbitMqConnection(dsn, logger, false);

    await rabbitMq.init();

    const channel = await rabbitMq.createChannel();

    assert.ok(channel !== undefined);

    await rabbitMq.close();
  });

  it("cannot create channel, connection has been closed", async () => {
    rabbitMq = new RabbitMqConnection(dsn, logger, false);

    await rabbitMq.init();
    rabbitMq.connection()?.emit(RabbitMqConnection.EVENT_CLOSE);
    await rabbitMq.close();

    const channel = await rabbitMq.createChannel();

    assert.strictEqual(channel, undefined);
  });
});
