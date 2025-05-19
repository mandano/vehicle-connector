import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { ProcessFromTcpInterfaceMessage } from "../../src/ProcessFromTcpInterfaceMessage.ts";
import { FakeTcpInterfaceMessageJsonConverter } from "../../../../common/test/entities/tcpInterfaceMessage/FakeTcpInterfaceMessageJsonConverter.ts";
import { TcpInterfaceMessage } from "../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";

import { FakeOnData } from "./handler/onData/FakeOnData.ts";
import { FakeOnDisconnection } from "./handler/FakeOnDisconnection.ts";

describe("ProcessFromTcpInterfaceMessage", () => {
  it("should return undefined if message is invalid", async () => {
    const fakeOnData = new FakeOnData(true);
    const fakeOnDisconnection = new FakeOnDisconnection(true);
    const tcpInterfaceMessageJsonConverter =
      new FakeTcpInterfaceMessageJsonConverter("random", undefined);

    const processFromTcpInterfaceMessage = new ProcessFromTcpInterfaceMessage(
      fakeOnData,
      fakeOnDisconnection,
      tcpInterfaceMessageJsonConverter,
    );

    const result = await processFromTcpInterfaceMessage.run("invalid message");

    assert.strictEqual(result, undefined);
  });

  it("should call onData.run if message type is onData", async () => {
    const onDataReturnValue = Math.random() < 0.5;
    const fakeOnData = new FakeOnData(onDataReturnValue);
    const fakeOnDisconnection = new FakeOnDisconnection(!onDataReturnValue);
    const tcpInterfaceMessageJsonConverter =
      new FakeTcpInterfaceMessageJsonConverter(
        "random",
        new TcpInterfaceMessage(
          TcpInterfaceMessage.onData,
          "asdf",
          "stringThatDoesNotDoAnything",
        ),
      );

    const processFromTcpInterfaceMessage = new ProcessFromTcpInterfaceMessage(
      fakeOnData,
      fakeOnDisconnection,
      tcpInterfaceMessageJsonConverter,
    );

    await processFromTcpInterfaceMessage.run("invalid message");
  });

  it("should call onDisconnection.run if message type is onDisconnection", async () => {
    const onDisconnectionReturnValue = Math.random() < 0.5;
    const fakeOnData = new FakeOnData(!onDisconnectionReturnValue);
    const fakeOnDisconnection = new FakeOnDisconnection(
      onDisconnectionReturnValue,
    );
    const tcpInterfaceMessageJsonConverter =
      new FakeTcpInterfaceMessageJsonConverter(
        "random",
        new TcpInterfaceMessage(
          TcpInterfaceMessage.onDisconnection,
          "asdf",
          "stringThatDoesNotDoAnything",
        ),
      );

    const processFromTcpInterfaceMessage = new ProcessFromTcpInterfaceMessage(
      fakeOnData,
      fakeOnDisconnection,
      tcpInterfaceMessageJsonConverter,
    );

    await processFromTcpInterfaceMessage.run("invalid message");
  });

  it("should return undefined if message type is unknown", async () => {
    const fakeOnData = new FakeOnData(true);
    const fakeOnDisconnection = new FakeOnDisconnection(true);
    const tcpInterfaceMessageJsonConverter =
      new FakeTcpInterfaceMessageJsonConverter(
        "random",
        new TcpInterfaceMessage(
          "unknownType",
          "asdf",
          "stringThatDoesNotDoAnything",
        ),
      );

    const processFromTcpInterfaceMessage = new ProcessFromTcpInterfaceMessage(
      fakeOnData,
      fakeOnDisconnection,
      tcpInterfaceMessageJsonConverter,
    );

    const result = await processFromTcpInterfaceMessage.run("invalid message");
    assert.strictEqual(result, undefined);
  });
});
