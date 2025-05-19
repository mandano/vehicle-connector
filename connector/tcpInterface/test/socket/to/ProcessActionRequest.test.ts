import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { HashColoredLoggerInterface } from "../../../../common/src/logger/HashColoredLoggerInterface.ts";
import { TcpInterfaceMessage } from "../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { FakeLogger } from "../../../../common/test/logger/FakeLogger.ts";
import { ProcessActionRequest } from "../../../src/socket/to/ProcessActionRequest.ts";
import { Sockets } from "../../../src/socket/Sockets.ts";
import { TcpInterfaceMessageJsonConverter } from "../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverter.ts";
import { FakeHashColoredLogger } from "../../../../common/test/logger/FakeHashColoredLogger.ts";
import { SocketFake } from "../SocketFake.ts";

describe("ProcessActionRequest", () => {
  let logger: FakeLogger;
  let hashColoredLogger: HashColoredLoggerInterface;

  beforeEach(() => {
    logger = new FakeLogger();
    hashColoredLogger = new FakeHashColoredLogger();
  });

  it("should log an error and return undefined if the message is invalid", async () => {
    const sockets = new Sockets();

    const processActionRequest = new ProcessActionRequest(
      sockets,
      new TcpInterfaceMessageJsonConverter(logger),
      logger,
      hashColoredLogger,
    );

    const result = await processActionRequest.run("invalid message");

    assert.ok(
      logger.loggedMessages.includes(
        "error: No message to be sent, invalid messageProcessActionRequest",
      ),
    );
    assert.ok(
      logger.loggedMessages.includes(
        "error: Error parsing JSON: SyntaxError: Unexpected token 'i', \"invalid message\" is not valid JSONTcpInterfaceMessageJsonConverter",
      ),
    );
    assert.strictEqual(result, undefined);
  });

  it("should log an error and return undefined if the socket is not found", async () => {
    const sockets = new Sockets();
    const socketId = "notFoundSocketId";
    const tcpInterfaceMessage = new TcpInterfaceMessage(
      TcpInterfaceMessage.onDisconnection,
      socketId,
      randomUUID(),
    );

    const processActionRequest = new ProcessActionRequest(
      sockets,
      new TcpInterfaceMessageJsonConverter(logger),
      logger,
      hashColoredLogger,
    );

    const result = await processActionRequest.run(
      new TcpInterfaceMessageJsonConverter(logger).toJson(tcpInterfaceMessage),
    );

    assert.ok(
      logger.loggedMessages.includes(
        `error: Socket not found, ${socketId}ProcessActionRequest`,
      ),
    );
    assert.strictEqual(result, undefined);
  });

  it("should log an error if the message is not sent", async () => {
    const sockets = new Sockets();

    const socketId = "socketId";
    const socket = new SocketFake();
    sockets.set(socketId, socket);
    const tcpInterfaceMessage = new TcpInterfaceMessage(
      TcpInterfaceMessage.onDisconnection,
      socketId,
      randomUUID(),
    );

    const processActionRequest = new ProcessActionRequest(
      sockets,
      new TcpInterfaceMessageJsonConverter(logger),
      logger,
      hashColoredLogger,
    );

    const result = await processActionRequest.run(
      new TcpInterfaceMessageJsonConverter(logger).toJson(tcpInterfaceMessage),
    );

    assert.ok(
      logger.loggedMessages.includes(
        `error: Message not sent, {"type":"onDisconnection","socketId":"${socketId}","data":"${tcpInterfaceMessage.data}"}ProcessActionRequest`,
      ),
    );
    assert.strictEqual(result, false);
  });

  it("should log a debug message if the message is sent", async () => {
    const sockets = new Sockets();

    const socketId = "socketId";
    const socket = new SocketFake(true);
    sockets.set(socketId, socket);
    const tcpInterfaceMessage = new TcpInterfaceMessage(
      TcpInterfaceMessage.onDisconnection,
      socketId,
      randomUUID(),
    );

    const processActionRequest = new ProcessActionRequest(
      sockets,
      new TcpInterfaceMessageJsonConverter(logger),
      logger,
      hashColoredLogger,
    );

    const result = await processActionRequest.run(
      new TcpInterfaceMessageJsonConverter(logger).toJson(tcpInterfaceMessage),
    );

    // TODO: check logging
    assert.strictEqual(result, true);
  });
});
