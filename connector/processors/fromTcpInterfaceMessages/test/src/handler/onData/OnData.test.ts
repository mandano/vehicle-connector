import { describe, it } from "node:test";

import { FakeLogger } from "../../../../../../common/test/logger/FakeLogger.ts";
import { LoggerInterface } from "../../../../../../common/src/logger/LoggerInterface.ts";
import { CreateTcpInterfaceMessage } from "../../../../../../common/test/entities/tcpInterfaceMessage/CreateTcpInterfaceMessage.ts";
import { OnData } from "../../../../src/handler/onData/OnData.ts";
import { FakeImeiSocketIdFileRepository } from "../../../../../../common/test/repositories/FakeImeiSocketIdFileRepository.ts";

import { HandleFirstPaketFake } from "./HandleFirstPaketFake.ts";
import { HandleNotFirstPaketFake } from "./HandleNotFirstPaketFake.ts";

describe("OnData", () => {
  const logger: LoggerInterface = new FakeLogger();

  it("should handle empty data", async () => {
    const tcpInterfaceMessage = new CreateTcpInterfaceMessage().run({
      data: "",
    });

    const onData = new OnData(
      new HandleFirstPaketFake(),
      new HandleNotFirstPaketFake(),
      logger,
      new FakeImeiSocketIdFileRepository(),
    );

    await onData.run(tcpInterfaceMessage);
  });

  it("should handle first packet when no IMEI is bound", async () => {
    const tcpInterfaceMessage = new CreateTcpInterfaceMessage().run();

    const onData = new OnData(
      new HandleFirstPaketFake(),
      new HandleNotFirstPaketFake(),
      logger,
      new FakeImeiSocketIdFileRepository({ getImeiReturnValue: undefined }),
    );

    await onData.run(tcpInterfaceMessage);
  });

  it("should handle subsequent packets when IMEI is bound", async () => {
    const tcpInterfaceMessage = new CreateTcpInterfaceMessage().run();

    const onData = new OnData(
      new HandleFirstPaketFake(),
      new HandleNotFirstPaketFake(),
      logger,
      new FakeImeiSocketIdFileRepository({
        getImeiReturnValue: "123456789012345",
      }),
    );

    await onData.run(tcpInterfaceMessage);
  });
});
