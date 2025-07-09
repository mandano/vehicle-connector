import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { instance, mock, verify, when } from "ts-mockito";
import LockState from "common/src/vehicle/components/lock/LockState.ts";
import OrphanedSocketValkeyRepository from "common/src/repositories/orphanedSocket/OrphanedSocketValkeyRepository.js";

import { HandleFirstPaket } from "../../../../src/handler/onData/HandleFirstPaket.ts";
import { FakeLogger } from "../../../../../../common/test/logger/FakeLogger.ts";
import { CreateMessageLineContext } from "../../messagLineContext/CreateMessageLineContext.ts";
import { FakeCreateByMessageLineContext } from "../../../../../../common/test/vehicle/model/builders/create/byMessageLineContext/FakeCreateByMessageLineContext.ts";
import { CreateUnknown } from "../../../../../../common/test/vehicle/model/models/create/CreateUnknown.ts";
import { Acknowledge } from "../../../../../../common/test/vehicle/iot/network/protocol/Acknowledge.fake.ts";
import { CreateUpdateSimpleScooter } from "../../../../../../../modules/protocols/theSimpleProtocol/test/connector/0_1/updateSimpleScooter/fromVehicle/CreateUpdateSimpleScooter.ts";
import { Create } from "../../../../../../../modules/protocols/common/src/connector/fromVehicle/Create.ts";
import BuildMessageLine from "../../../../../../../modules/protocols/theSimpleProtocol/src/simulator/0_1/pakets/simpleUpdate/toConnector/CreateMessageLine.ts";
import ImeiSocketIdValkeyRepository from "../../../../../../common/src/repositories/imeiSocketId/ImeiSocketIdValkeyRepository.ts";
import { MessageLineContext } from "../../../../../../common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";
import { THE_SIMPLE_PROTOCOL } from "../../../../../../../modules/protocols/theSimpleProtocol/src/Protocol.ts";
import { ID_0_1 } from "../../../../../../../modules/protocols/theSimpleProtocol/src/versions.ts";
import { Lock } from "../../../../../../common/src/vehicle/components/lock/Lock.ts";
import { FakeSendActionRequest } from "../../../../../../common/test/vehicle/model/actions/FakeSendActionRequest.ts";
import { State } from "../../../../../../common/src/vehicle/State.ts";

import { ForwardToActionResponses } from "./ForwardToActionResponses.fake.ts";
import { SaveMessageLineContextToVehicle } from "./SaveMessageLineContextToVehicle.fake.ts";

describe("HandleFirstPaket", () => {
  const logger: FakeLogger = new FakeLogger();

  it("should return early if IMEI is undefined", async () => {
    const imei = "123456789012345";
    const updateSimpleScooter = new CreateUpdateSimpleScooter().run();
    const messageLine = new BuildMessageLine().run(updateSimpleScooter, imei);

    const socketId = "socket123";
    const saveMessageLineContextToVehicle =
      new SaveMessageLineContextToVehicle();
    const createModelByPaket = new FakeCreateByMessageLineContext(
      new CreateUnknown().run(),
    );
    const forwardLockAttribute = new ForwardToActionResponses();
    const acknowledge = new Acknowledge();

    const mockedCreate = mock(Create);
    const createInstance = instance(mockedCreate);
    when(mockedCreate.run(messageLine)).thenReturn(
      new CreateMessageLineContext().run(),
    );

    const mockedImeiSocketIdRepository = mock(ImeiSocketIdValkeyRepository);
    const imeiSocketIdRepository = instance(mockedImeiSocketIdRepository);

    const mockedOrphanedSocketRepository = mock(OrphanedSocketValkeyRepository);
    const orphanedSocketRepository = instance(mockedOrphanedSocketRepository);

    const handleFirstPaket = new HandleFirstPaket(
      imeiSocketIdRepository,
      saveMessageLineContextToVehicle,
      createModelByPaket,
      forwardLockAttribute,
      acknowledge,
      logger,
      createInstance,
      orphanedSocketRepository,
    );

    await handleFirstPaket.run(messageLine, socketId);

    verify(mockedImeiSocketIdRepository.delete(imei)).never();
  });

  it("should create IMEI-SocketId mapping", async () => {
    const socketId = "socket123";
    const imei = "123456789012345";

    const updateSimpleScooter = new CreateUpdateSimpleScooter().run({
      imei: imei,
    });
    const messageLine = new BuildMessageLine().run(updateSimpleScooter, imei);

    const mockedImeiSocketIdRepository = mock(ImeiSocketIdValkeyRepository);
    when(mockedImeiSocketIdRepository.create(imei, socketId)).thenResolve(true);
    const imeiSocketIdRepository = instance(mockedImeiSocketIdRepository);

    const saveMessageLineContextToVehicle =
      new SaveMessageLineContextToVehicle();

    const createModelByPaket = new FakeCreateByMessageLineContext(
      new CreateUnknown().run(),
    );
    const forwardLockAttribute = new ForwardToActionResponses();
    const acknowledge = new Acknowledge();
    const mockedCreate = mock(Create);

    const createInstance = instance(mockedCreate);
    when(mockedCreate.run(messageLine)).thenReturn(
      new MessageLineContext(
        THE_SIMPLE_PROTOCOL,
        updateSimpleScooter,
        ID_0_1,
        updateSimpleScooter.trackingId,
        updateSimpleScooter.imei,
      ),
    );

    const mockedOrphanedSocketRepository = mock(OrphanedSocketValkeyRepository);
    const orphanedSocketRepository = instance(mockedOrphanedSocketRepository);

    const handleFirstPaket = new HandleFirstPaket(
      imeiSocketIdRepository,
      saveMessageLineContextToVehicle,
      createModelByPaket,
      forwardLockAttribute,
      acknowledge,
      logger,
      createInstance,
      orphanedSocketRepository,
    );

    await handleFirstPaket.run(messageLine, socketId);

    verify(mockedImeiSocketIdRepository.create(imei, socketId)).once();
  });

  it("should forward lock state when available", async () => {
    const socketId = "socket123";
    const imei = "123456789012345";

    const updateSimpleScooter = new CreateUpdateSimpleScooter().run();
    const messageLine = new BuildMessageLine().run(updateSimpleScooter, imei);
    const saveMessageLineContextToVehicle = new SaveMessageLineContextToVehicle(
      123,
    );

    const unknown = new CreateUnknown().run({
      lock: new Lock(
        new FakeSendActionRequest(),
        new LockState(new State(Lock.LOCKED)),
      ),
    });

    if (unknown.lock?.state === undefined) {
      assert.fail("Lock state is undefined");
    }

    const createModelByPaket = new FakeCreateByMessageLineContext(
      new CreateUnknown().run(),
    );
    const mockedForwardLockAttribute = mock(ForwardToActionResponses);
    const forwardLockAttribute = instance(mockedForwardLockAttribute);
    const acknowledge = new Acknowledge();

    const mockedCreate = mock(Create);
    const createInstance = instance(mockedCreate);
    when(mockedCreate.run(messageLine)).thenReturn(
      new CreateMessageLineContext().run(),
    );

    const mockedImeiSocketIdRepository = mock(ImeiSocketIdValkeyRepository);
    when(mockedImeiSocketIdRepository.create(imei, socketId)).thenResolve(true);
    const imeiSocketIdRepository = instance(mockedImeiSocketIdRepository);

    const mockedOrphanedSocketRepository = mock(OrphanedSocketValkeyRepository);
    const orphanedSocketRepository = instance(mockedOrphanedSocketRepository);

    const handleFirstPaket = new HandleFirstPaket(
      imeiSocketIdRepository,
      saveMessageLineContextToVehicle,
      createModelByPaket,
      forwardLockAttribute,
      acknowledge,
      logger,
      createInstance,
      orphanedSocketRepository,
    );

    await handleFirstPaket.run(messageLine, socketId);

    verify(
      mockedForwardLockAttribute.run(unknown.lock.state.state.state, 123),
    ).once();
  });

  it("should log error when acknowledgment fails", async () => {
    const socketId = "socket123";
    const imei = "123456789012345";

    const updateSimpleScooter = new CreateUpdateSimpleScooter().run();
    const messageLine = new BuildMessageLine().run(updateSimpleScooter, imei);
    const saveMessageLineContextToVehicle =
      new SaveMessageLineContextToVehicle();
    const createModelByPaket = new FakeCreateByMessageLineContext(
      new CreateUnknown().run(),
    );
    const forwardLockAttribute = new ForwardToActionResponses();
    const acknowledge = new Acknowledge(false);

    const mockedCreate = mock(Create);
    const createInstance = instance(mockedCreate);
    when(mockedCreate.run(messageLine)).thenReturn(
      new CreateMessageLineContext().run(),
    );

    const mockedImeiSocketIdRepository = mock(ImeiSocketIdValkeyRepository);
    when(mockedImeiSocketIdRepository.create(imei, socketId)).thenResolve(true);
    const imeiSocketIdRepository = instance(mockedImeiSocketIdRepository);

    const mockedOrphanedSocketRepository = mock(OrphanedSocketValkeyRepository);
    const orphanedSocketRepository = instance(mockedOrphanedSocketRepository);

    const handleFirstPaket = new HandleFirstPaket(
      imeiSocketIdRepository,
      saveMessageLineContextToVehicle,
      createModelByPaket,
      forwardLockAttribute,
      acknowledge,
      logger,
      createInstance,
      orphanedSocketRepository,
    );

    await handleFirstPaket.run(messageLine, socketId);
    assert(
      logger.loggedMessages.includes(
        "info: Acknowledge not sentHandleFirstPaket",
      ),
    );
  });
});
