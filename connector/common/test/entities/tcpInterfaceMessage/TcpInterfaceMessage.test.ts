import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { TcpInterfaceMessage } from "../../../src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";

describe("TcpInterfaceMessage", () => {
  it("should create instance with required properties", () => {
    const message = new TcpInterfaceMessage(TcpInterfaceMessage.onData, "socket123", "test data");

    assert.strictEqual(message.type, TcpInterfaceMessage.onData);
    assert.strictEqual(message.socketId, "socket123");
    assert.strictEqual(message.data, "test data");
    assert.strictEqual(message.trackingId, undefined);
  });

  it("should create instance with optional trackingId", () => {
    const message = new TcpInterfaceMessage(TcpInterfaceMessage.onConnection, "socket123", "test data", "track123");

    assert.strictEqual(message.type, TcpInterfaceMessage.onConnection);
    assert.strictEqual(message.socketId, "socket123");
    assert.strictEqual(message.data, "test data");
    assert.strictEqual(message.trackingId, "track123");
  });

  it("should have correct static event type constants", () => {
    assert.strictEqual(TcpInterfaceMessage.onDisconnection, "onDisconnection");
    assert.strictEqual(TcpInterfaceMessage.onConnection, "onConnection");
    assert.strictEqual(TcpInterfaceMessage.onData, "onData");
  });
});