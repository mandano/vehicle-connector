import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { faker } from "@faker-js/faker";

import { ExchangeQueue } from "../../../../src/adapters/queue/rabbitMq/ExchangeQueue.ts";
import { RabbitMqConnection } from "../../../../src/adapters/queue/rabbitMq/RabbitMqConnection.ts";
import { FakeLogger } from "../../../logger/FakeLogger.ts";
import { Channel } from "../../../../src/adapters/queue/rabbitMq/Channel.ts";
import { FakeOnMessage } from "../FakeOnMessage.ts";
import { Exchange } from "../../../../src/adapters/queue/rabbitMq/Exchange.ts";

describe("ExchangeQueue", () => {
  let logger: FakeLogger;
  let rabbitMqConnection: RabbitMqConnection;
  let channel: Channel;

  const port = process.env.RABBITMQ_PORT || "5672";
  const user = process.env.RABBITMQ_USER || "user";
  const password = process.env.RABBITMQ_PASSWORD || "password";
  const host = process.env.RABBITMQ_HOST || "localhost";

  beforeEach(() => {
    logger = new FakeLogger();
    const url = `amqp://${user}:${password}@${host}:${port}`;
    rabbitMqConnection = new RabbitMqConnection(url, logger);
    channel = new Channel(rabbitMqConnection, logger);
  });

  it("can consume", { timeout: 7000 }, async () => {
    const testMessage = faker.lorem.sentence();
    const consume = new FakeOnMessage(true);
    const consumeWithTimeout = new FakeOnMessage(true);
    const exchange = new Exchange(channel, "testExchange", logger);

    const exchangeQueue = new ExchangeQueue(
      channel,
      consume,
      consumeWithTimeout,
      exchange,
      "testApp",
      logger,
      true,
      true,
    );
    const consumerSet = await exchangeQueue.consume();

    assert.strictEqual(consumerSet, true);

    await channel.publish(exchange.name, "", Buffer.from(testMessage));

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const queueDetails = await channel.checkQueue(exchangeQueue.name);

    if (queueDetails === undefined) {
      await rabbitMqConnection.close();
      assert.fail("Queue should exist");
    }

    assert.strictEqual(queueDetails.messageCount, 0);
    assert.strictEqual(queueDetails.consumerCount, 1);

    await channel.deleteQueue(exchangeQueue.name);
    await channel.deleteExchange(exchange.name);
    await channel.close();
  });

  it("can consume with timeout", { timeout: 7000 }, async () => {
    const testMessage = faker.lorem.sentence();
    const consume = new FakeOnMessage(true);
    const consumeWithTimeout = new FakeOnMessage(true);
    const exchange = new Exchange(channel, "testExchange", logger);

    const exchangeQueue = new ExchangeQueue(
      channel,
      consume,
      consumeWithTimeout,
      exchange,
      "testApp",
      logger,
      true,
      true,
    );
    await exchangeQueue.init();

    setTimeout(async () => {
      await channel.publish(exchange.name, "", Buffer.from(testMessage));
    }, 2000);

    const result = await exchangeQueue.consumeWithTimeout(5000);

    assert.strictEqual(result, true);

    await channel.deleteExchange(exchange.name);

    const assertedQueue = await channel.checkQueue(exchangeQueue.name);

    if (assertedQueue !== undefined) {
      await rabbitMqConnection.close();
      assert.fail("Queue should not exist");
    }

    await channel.deleteExchange(exchange.name);
    await channel.close();
  });

  it("can consume with timeout, one publisher, two consumers", { timeout: 7000 }, async () => {
    const testMessage = faker.lorem.sentence();
    const consume = new FakeOnMessage(true);
    const consumeWithTimeout = new FakeOnMessage(true);
    const exchange = new Exchange(channel, "testExchange", logger);

    const exchangeQueueOne = new ExchangeQueue(
      channel,
      consume,
      consumeWithTimeout,
      exchange,
      "testApp",
      logger,
      true,
      true,
    );
    await exchangeQueueOne.init();

    const exchangeQueueTwo = new ExchangeQueue(
      channel,
      consume,
      consumeWithTimeout,
      exchange,
      "testApp",
      logger,
      true,
      true,
    );
    await exchangeQueueTwo.init();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await channel.publish(exchange.name, "", Buffer.from(testMessage));

    const [resultExchangeQueueOne, resultExchangeQueueTwo] = await Promise.all([
      exchangeQueueOne.consumeWithTimeout(5000),
      exchangeQueueTwo.consumeWithTimeout(5000),
    ]);

    assert.strictEqual(resultExchangeQueueOne, true);
    assert.strictEqual(resultExchangeQueueTwo, true);

    await channel.deleteExchange(exchange.name);

    const assertedQueueOne = await channel.checkQueue(exchangeQueueOne.name);

    if (assertedQueueOne !== undefined) {
      await rabbitMqConnection.close();
      assert.fail("Queue should not exist");
    }

    const assertedQueueTwo = await channel.checkQueue(exchangeQueueTwo.name);

    if (assertedQueueTwo !== undefined) {
      await rabbitMqConnection.close();
      assert.fail("Queue should not exist");
    }

    await channel.deleteExchange(exchange.name);
    await channel.close();
  });


  it("times out consumption", { timeout: 7000 }, async () => {
    const testMessage = "test message";
    const consume = new FakeOnMessage(true);
    const consumeWithTimeout = new FakeOnMessage(false);
    const exchange = new Exchange(channel, "testExchange", logger);

    const exchangeQueue = new ExchangeQueue(
      channel,
      consume,
      consumeWithTimeout,
      exchange,
      "testApp",
      logger,
      true,
      true,
    );
    await exchangeQueue.init();

    setTimeout(async () => {
      await channel.publish(exchange.name, "", Buffer.from(testMessage));
    }, 2000);

    const result = await exchangeQueue.consumeWithTimeout(5000);

    assert.strictEqual(result, false);

    await channel.deleteExchange(exchange.name);

    const assertedQueue = await channel.checkQueue(exchangeQueue.name);

    if (assertedQueue !== undefined) {
      assert.fail();
    }
    await rabbitMqConnection.close();
  });

  it("consumes, can handle deleted queue", async () => {
    const consume = new FakeOnMessage(true);
    const consumeWithTimeout = new FakeOnMessage(false);
    const exchange = new Exchange(channel, "testExchange", logger);

    const exchangeQueue = new ExchangeQueue(
      channel,
      consume,
      consumeWithTimeout,
      exchange,
      "testApp",
      logger,
      true,
      true,
    );
    await exchangeQueue.init();

    await channel.deleteExchange(exchange.name);

    setTimeout(async () => {
      await channel.deleteQueue(exchangeQueue.name);
    }, 2000);

    const result = await exchangeQueue.consumeWithTimeout(5000);

    assert.strictEqual(result, false);
    await rabbitMqConnection.close();
  });

  it("can consume without timeout", { timeout: 20000 }, async () => {
    const testMessageOne = faker.lorem.sentence();
    const testMessageTwo = faker.lorem.sentence();
    const consume = new FakeOnMessage(true);
    const consumeWithTimeout = new FakeOnMessage(true);
    const exchange = new Exchange(channel, "testExchange", logger);

    const exchangeQueue = new ExchangeQueue(
      channel,
      consume,
      consumeWithTimeout,
      exchange,
      "testApp",
      logger,
      true,
      true,
    );

    const result = await exchangeQueue.consume();
    assert.strictEqual(result, true);

    // Publish messages sequentially with delays
    await channel.publish(exchange.name, "", Buffer.from(testMessageOne));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await channel.publish(exchange.name, "", Buffer.from(testMessageTwo));
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const assertedQueue = await channel.checkQueue(exchangeQueue.name);

    if (assertedQueue === undefined) {
      await rabbitMqConnection.close();
      assert.fail("Queue should exist");
    }

    assert.ok(consume.messages.includes(testMessageOne));
    assert.ok(consume.messages.includes(testMessageTwo));

    await channel.deleteExchange(exchange.name);
    await channel.close();
  });
});
