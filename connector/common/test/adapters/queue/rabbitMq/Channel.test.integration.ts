import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { Channel } from "../../../../src/adapters/queue/rabbitMq/Channel.ts";
import { FakeLogger } from "../../../logger/FakeLogger.ts";
import { RabbitMqConnection } from "../../../../src/adapters/queue/rabbitMq/RabbitMqConnection.ts";
import { FakeOnMessage } from "../FakeOnMessage.ts";
import { Exchange } from "../../../../src/adapters/queue/rabbitMq/Exchange.ts";

describe("Channel", () => {
  let rabbitMqConnection: RabbitMqConnection;
  let logger: FakeLogger;
  let testQueueName = "test";

  const port = process.env.RABBITMQ_PORT || "5672";
  const user = process.env.RABBITMQ_USER || "user";
  const password = process.env.RABBITMQ_PASSWORD || "password";
  const host = process.env.RABBITMQ_HOST || "localhost";

  beforeEach(() => {
    logger = new FakeLogger();
    const url = `amqp://${user}:${password}@${host}:${port}`;

    rabbitMqConnection = new RabbitMqConnection(url, logger);
  });

  it("should initialize the channel successfully", async () => {
    const channel = new Channel(rabbitMqConnection, logger);

    const result = await channel.init();
    assert.strictEqual(result, true);

    await channel.close();
  });

  it("should return undefined if not connected when asserting queue", async () => {
    const channel = new Channel(rabbitMqConnection, logger);

    const result = await channel.assertQueue("test", { durable: false });
    assert.strictEqual(result, false);
  });

  it("should assert queue successfully when connected", async () => {
    const channel = new Channel(rabbitMqConnection, logger);

    await channel.init();
    const result = await channel.assertQueue("test", { durable: false });
    assert.strictEqual(result, true);
    await channel.deleteQueue("test");

    await channel.close();
  });

  it("should log info on channel close event", async () => {
    const channel = new Channel(rabbitMqConnection, logger);

    await channel.init();

    channel.channel?.emit(Channel.EVENT_ON_CLOSE);
    assert(logger.loggedMessages.includes("info: Channel closedChannel"));
    assert.strictEqual(channel.connected, false);

    await channel.close();
  });

  it("should log error on channel error event", async () => {
    const channel = new Channel(rabbitMqConnection, logger);

    await channel.init();

    channel.channel?.emit(Channel.EVENT_ON_ERROR);
    assert(
      logger.loggedMessages.includes("error: Channel error: undefinedChannel"),
    );
    assert.strictEqual(channel.connected, false);

    await channel.close();
  });

  it("Send to queue", async () => {
    testQueueName = `testSendToQueue_${Math.random().toString(36).substring(2, 15)}`;
    const testMessage = "test";
    const channel = new Channel(rabbitMqConnection, logger);

    await channel.init();

    await channel.assertQueue(testQueueName, { durable: false });
    const sent = channel.sendToQueue(testQueueName, testMessage);
    const message = await channel.getMessage(testQueueName);

    assert.strictEqual(sent, true);
    assert.strictEqual(message, testMessage);

    await channel.deleteQueue(testQueueName);
    await channel.close();
  });

  it("can consume", async () => {
    testQueueName = `testCanConsume_${Math.random().toString(36).substring(2, 15)}`;
    const testMessage = "test";
    const channel = new Channel(rabbitMqConnection, logger);

    await channel.init();

    await channel.assertQueue(testQueueName, { durable: false });
    const sent = channel.sendToQueue(testQueueName, testMessage);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let queueDetails = await channel.checkQueue(testQueueName);

    if (queueDetails === undefined) {
      assert.strictEqual(true, false);
      return;
    }

    assert.strictEqual(queueDetails.messageCount, 1);

    const onMessage = new FakeOnMessage(true);
    const consumerSet = await channel.consume(testQueueName, onMessage, true);

    assert.strictEqual(sent, true);
    assert.strictEqual(consumerSet, true);

    queueDetails = await channel.checkQueue(testQueueName);

    if (queueDetails === undefined) {
      assert.fail("Queue details should not be undefined");
      return;
    }

    assert.strictEqual(queueDetails.messageCount, 0);
    assert.strictEqual(queueDetails.consumerCount, 1);

    await channel.deleteQueue(testQueueName);
    await channel.close();
  });

  it("tries to get message, but queue deleted", async () => {
    testQueueName = `testSendToQueue_${Math.random().toString(36).substring(2, 15)}`;
    const testMessage = "test";
    const channel = new Channel(rabbitMqConnection, logger);

    await channel.init();

    await channel.assertQueue(testQueueName, { durable: false });
    channel.sendToQueue(testQueueName, testMessage);

    await channel.deleteQueue(testQueueName);
    await channel.close();

    const message = await channel.getMessage(testQueueName);

    assert.strictEqual(message, false);
  });

  it("should assert exchange successfully when connected", async () => {
    const channel = new Channel(rabbitMqConnection, logger);
    const exchangeName = `testExchange_${Math.random().toString(36).substring(2, 15)}`;

    await channel.init();
    const result = await channel.assertExchange(
      exchangeName,
      Exchange.TYPE_FANOUT,
      { durable: false },
    );
    assert.strictEqual(result, true);
    const asdf = await channel.checkExchange(exchangeName);
    assert.notStrictEqual(asdf, false);

    await channel.deleteExchange(exchangeName);
    await channel.close();
  });

  it("should publish message successfully", async () => {
    const channel = new Channel(rabbitMqConnection, logger);
    const exchangeName = `testExchange_${Math.random().toString(36).substring(2, 15)}`;
    const testMessage = "testMessage";

    await channel.init();
    await channel.assertExchange(exchangeName, Exchange.TYPE_FANOUT, {
      durable: false,
    });
    const result = await channel.publish(
      exchangeName,
      "",
      Buffer.from(testMessage),
    );
    assert.strictEqual(result, true);

    await channel.deleteExchange(exchangeName);
    await channel.close();
  });

  it("should bind queue successfully", async () => {
    const channel = new Channel(rabbitMqConnection, logger);
    const queueName = `testQueue_${Math.random().toString(36).substring(2, 15)}`;
    const exchangeName = `testExchange_${Math.random().toString(36).substring(2, 15)}`;

    await channel.init();
    await channel.assertQueue(queueName, { durable: false });
    await channel.assertExchange(exchangeName, Exchange.TYPE_FANOUT, {
      durable: false,
    });
    const result = await channel.bindQueue(queueName, exchangeName, "");
    assert.strictEqual(result, true);

    await channel.deleteQueue(queueName);
    await channel.deleteExchange(exchangeName);
    await channel.close();
  });

  it("should get successful response from consuming message with timeout", async () => {
    testQueueName = `testConsumeWithTimeout_${Math.random().toString(36).substring(2, 15)}`;
    const testExchangeName = `testExchange_${Math.random().toString(36).substring(2, 15)}`;
    const testMessage = "test";
    const channel = new Channel(rabbitMqConnection, logger);

    await channel.init();
    await channel.assertQueue(testQueueName, { durable: false });
    await channel.assertExchange(testExchangeName, Exchange.TYPE_FANOUT, {
      durable: false,
    });
    await channel.bindQueue(testQueueName, testExchangeName, "");

    const onMessage = new FakeOnMessage(true);

    const consumptionPromise = channel.consumeFromExchangeWithTimeout(
      testQueueName,
      onMessage,
      true,
      7000,
      { vehicleId: 1 },
    );

    setTimeout(async () => {
      await channel.publish(testExchangeName, "", Buffer.from(testMessage));
    }, 1000);

    const result = await consumptionPromise;

    assert.strictEqual(result, true);

    const assertedQueue = await channel.checkQueue(testQueueName);

    if (assertedQueue !== undefined) {
      assert.strictEqual(false, true);
    }

    await channel.deleteExchange(testExchangeName);
    await channel.close();
  });

  it(
    "should timeout after waiting for successful messages with timeout",
    { timeout: 15000 },
    async () => {
      testQueueName = `testConsumeWithTimeout_${Math.random().toString(36).substring(2, 15)}`;
      const testExchangeName = `testExchange_${Math.random().toString(36).substring(2, 15)}`;
      const testMessage = "test";
      const channel = new Channel(rabbitMqConnection, logger);

      await channel.init();
      await channel.assertQueue(testQueueName, { durable: false });
      await channel.assertExchange(testExchangeName, Exchange.TYPE_FANOUT, {
        durable: false,
      });
      await channel.bindQueue(testQueueName, testExchangeName, "");

      const onMessage = new FakeOnMessage(false);

      setTimeout(async () => {
        await channel.publish(testExchangeName, "", Buffer.from(testMessage));
      }, 2000);

      const result = await channel.consumeFromExchangeWithTimeout(
        testQueueName,
        onMessage,
        true,
        7000,
        { vehicleId: 1 },
      );

      assert.strictEqual(result, false);

      await channel.deleteExchange(testExchangeName);

      const assertedQueue = await channel.checkQueue(testQueueName);
      if (assertedQueue !== undefined) {
        assert.strictEqual(false, true);

      }
      await rabbitMqConnection.close();
    },
  );

  it("should timeout after waiting for messages, no messages sent", async () => {
    testQueueName = "testConsumeWithTimeout";
    const channel = new Channel(rabbitMqConnection, logger);

    await channel.init();
    await channel.assertQueue(testQueueName, { durable: false });

    const onMessage = new FakeOnMessage(false);

    const result = await channel.consumeFromExchangeWithTimeout(
      testQueueName,
      onMessage,
      true,
      3000,
      { vehicleId: 1 },
    );

    assert.strictEqual(result, false);

    const assertedQueue = await channel.checkQueue(testQueueName);
    if (assertedQueue !== undefined) {
      await channel.deleteQueue(testQueueName);
      assert.fail("Queue should have been deleted");

    }
    await rabbitMqConnection.close();
  });
});
