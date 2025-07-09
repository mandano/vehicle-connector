import { describe, it } from "node:test";

import { anything, instance, mock, when } from "ts-mockito";
import ImeiSocketIdValkeyRepository from "common/src/repositories/imeiSocketId/ImeiSocketIdValkeyRepository.js";
import { de, Faker } from "@faker-js/faker";
import { FakeLogger } from "common/test/logger/FakeLogger.ts";
import { LoggerInterface } from "common/src/logger/LoggerInterface.ts";
import { CreateTcpInterfaceMessage } from "common/test/entities/tcpInterfaceMessage/CreateTcpInterfaceMessage.ts";

import { OnData } from "../../../../src/handler/onData/OnData.ts";

import { HandleFirstPaketFake } from "./HandleFirstPaketFake.ts";
import { HandleNotFirstPaketFake } from "./HandleNotFirstPaketFake.ts";

describe("OnData", () => {
  const logger: LoggerInterface = new FakeLogger();
  const faker: Faker = new Faker({ locale: [de] });

  it("should handle empty data", async () => {
    const tcpInterfaceMessage = new CreateTcpInterfaceMessage().run({
      data: "",
    });

    const mockedImeiSocketIdRepository = mock(ImeiSocketIdValkeyRepository);
    when(
      mockedImeiSocketIdRepository.getImeiInSocketIdKey(anything()),
    ).thenResolve(faker.phone.imei());
    const imeiSocketIdRepository = instance(mockedImeiSocketIdRepository);

    const onData = new OnData(
      new HandleFirstPaketFake(),
      new HandleNotFirstPaketFake(),
      logger,
      imeiSocketIdRepository,
    );

    await onData.run(tcpInterfaceMessage);
  });

  it("should handle first packet when no IMEI is bound", async () => {
    const tcpInterfaceMessage = new CreateTcpInterfaceMessage().run();

    const mockedImeiSocketIdRepository = mock(ImeiSocketIdValkeyRepository);
    when(
      mockedImeiSocketIdRepository.getImeiInSocketIdKey(anything()),
    ).thenResolve(undefined);
    const imeiSocketIdRepository = instance(mockedImeiSocketIdRepository);

    const onData = new OnData(
      new HandleFirstPaketFake(),
      new HandleNotFirstPaketFake(),
      logger,
      imeiSocketIdRepository,
    );

    await onData.run(tcpInterfaceMessage);
  });

  it("should handle subsequent packets when IMEI is bound", async () => {
    const tcpInterfaceMessage = new CreateTcpInterfaceMessage().run();

    const mockedImeiSocketIdRepository = mock(ImeiSocketIdValkeyRepository);
    when(
      mockedImeiSocketIdRepository.getImeiInSocketIdKey(anything()),
    ).thenResolve(faker.phone.imei());
    const imeiSocketIdRepository = instance(mockedImeiSocketIdRepository);

    const onData = new OnData(
      new HandleFirstPaketFake(),
      new HandleNotFirstPaketFake(),
      logger,
      imeiSocketIdRepository,
    );

    await onData.run(tcpInterfaceMessage);
  });
});
