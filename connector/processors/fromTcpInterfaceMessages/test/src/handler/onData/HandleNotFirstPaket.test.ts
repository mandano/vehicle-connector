import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { anything, instance, mock, verify, when } from "ts-mockito";

import { FakeLogger } from "../../../../../../common/test/logger/FakeLogger.ts";
import { FakeCreateByMessageLineContext } from "../../../../../../common/test/vehicle/model/builders/create/byMessageLineContext/FakeCreateByMessageLineContext.ts";
import { CreateUnknown } from "../../../../../../common/test/vehicle/model/models/create/CreateUnknown.ts";
import { Acknowledge } from "../../../../../../common/test/vehicle/iot/network/protocol/Acknowledge.fake.ts";
import { HandleNotFirstPaket } from "../../../../src/handler/onData/HandleNotFirstPaket.ts";
import { CreateUpdateSimpleScooter } from "../../../../../../../modules/protocols/theSimpleProtocol/test/connector/0_1/updateSimpleScooter/fromVehicle/CreateUpdateSimpleScooter.ts";
import BuildMessageLine from "../../../../../../../modules/protocols/theSimpleProtocol/src/simulator/0_1/pakets/simpleUpdate/toConnector/CreateMessageLine.ts";
import { FakeVehicleFileSystemRepository } from "../../../../../../common/test/repositories/FakeVehicleFileSystemRepository.ts";
import { UpdateVehicle } from "../../../../src/handler/onData/UpdateVehicle.ts";
import { Vehicle } from "../../../../../../common/src/vehicle/Vehicle.ts";
import VehicleFileSystemRepository from "../../../../../../common/src/repositories/VehicleFileSystemRepository.ts";
import { Network } from "../../../../../../common/src/vehicle/components/iot/network/Network.ts";
import { ConnectionModule } from "../../../../../../common/src/vehicle/components/iot/network/ConnectionModule.ts";
import { State } from "../../../../../../common/src/vehicle/State.ts";
import { THE_SIMPLE_PROTOCOL } from "../../../../../../../modules/protocols/theSimpleProtocol/src/Protocol.ts";
import { ID_0_1 } from "../../../../../../../modules/protocols/theSimpleProtocol/src/versions.ts";
import { CreateMessageLineContext } from "../../messagLineContext/CreateMessageLineContext.ts";
import { CreateByProtocolAndVersion } from "../../../../../../common/test/vehicle/components/iot/network/protocol/messageLineContext/protocol/CreateByProtocolAndVersion.fake.ts";
import { Lock } from "../../../../../../common/src/vehicle/components/lock/Lock.ts";
import { FakeSendActionRequest } from "../../../../../../common/test/vehicle/model/actions/FakeSendActionRequest.ts";

import { ForwardToActionResponses } from "./ForwardToActionResponses.fake.ts";

describe("HandleNotFirstPaket", () => {
  const logger: FakeLogger = new FakeLogger();

  it("should process message line context and save to vehicle", async () => {
    const imei = "123456789012345";
    const socketId = "socket123";
    const protocolVersion = ID_0_1;
    const protocol = THE_SIMPLE_PROTOCOL;
    const connectionModule = new ConnectionModule(
      imei,
      new State(ConnectionModule.CONNECTED),
      undefined,
      new State(protocol),
      undefined,
      new State(protocolVersion),
    );
    const vehicle = new Vehicle(
      123,
      new CreateUnknown().run({
        network: new Network([connectionModule]),
      }),
      new Date(),
    );
    const updateSimpleScooter = new CreateUpdateSimpleScooter().run();
    const messageLine = new BuildMessageLine().run(updateSimpleScooter, imei);
    const createModelByPaket = new FakeCreateByMessageLineContext(
      new CreateUnknown().run(),
    );
    const mockedUpdateVehicle = mock(UpdateVehicle);
    const updateVehicle = instance(mockedUpdateVehicle);
    const messageLineContext = new CreateMessageLineContext().run();

    const createByProtocolAndVersion = new CreateByProtocolAndVersion(
      messageLineContext,
    );

    const forwardLockAttribute = new ForwardToActionResponses();
    const acknowledge = new Acknowledge();
    const mockedVehicleRepository = mock(VehicleFileSystemRepository);
    when(mockedVehicleRepository.findByImei(imei)).thenReturn(vehicle);

    const vehicleRepository = instance(mockedVehicleRepository);

    const handleNotFirstPaket = new HandleNotFirstPaket(
      vehicleRepository,
      updateVehicle,
      createByProtocolAndVersion,
      createModelByPaket,
      forwardLockAttribute,
      acknowledge,
      logger,
    );

    await handleNotFirstPaket.run(messageLine, imei, socketId);
    verify(mockedUpdateVehicle.run(anything(), anything())).called();
  });

  it("should forward lock state when available", async () => {
    const imei = "123456789012345";
    const socketId = "socket123";
    const protocolVersion = ID_0_1;
    const protocol = THE_SIMPLE_PROTOCOL;
    const connectionModule = new ConnectionModule(
      imei,
      new State(ConnectionModule.CONNECTED),
      undefined,
      new State(protocol),
      undefined,
      new State(protocolVersion),
    );
    const lockState = new State(Lock.LOCKED);
    const lock = new Lock(new FakeSendActionRequest(), lockState);
    const vehicle = new Vehicle(
      123,
      new CreateUnknown().run({
        network: new Network([connectionModule]),
        lock: lock,
      }),
      new Date(),
    );
    const updateSimpleScooter = new CreateUpdateSimpleScooter().run();
    const messageLineContext = new CreateMessageLineContext().run();

    const createByProtocolAndVersion = new CreateByProtocolAndVersion(
      messageLineContext,
    );

    const messageLine = new BuildMessageLine().run(updateSimpleScooter, imei);
    const mockedUpdateVehicle = mock(UpdateVehicle);
    const updateVehicle = instance(mockedUpdateVehicle);
    const createModelByPaket = new FakeCreateByMessageLineContext(
      new CreateUnknown().run(),
    );
    const mockedForwardLockAttribute = mock(ForwardToActionResponses);
    const forwardLockAttribute = instance(mockedForwardLockAttribute);
    const acknowledge = new Acknowledge();

    const mockedVehicleRepository = mock(VehicleFileSystemRepository);
    when(mockedVehicleRepository.findByImei(imei)).thenReturn(vehicle);

    const vehicleRepository = instance(mockedVehicleRepository);

    const handleNotFirstPaket = new HandleNotFirstPaket(
      vehicleRepository,
      updateVehicle,
      createByProtocolAndVersion,
      createModelByPaket,
      forwardLockAttribute,
      acknowledge,
      logger,
    );

    await handleNotFirstPaket.run(messageLine, imei, socketId);
    verify(
      mockedForwardLockAttribute.run(lockState.state, vehicle.id),
    ).called();
  });

  it("should not forward lock state when vehicle id is undefined", async () => {
    const imei = "123456789012345";
    const socketId = "socket123";
    const updateSimpleScooter = new CreateUpdateSimpleScooter().run();
    const messageLine = new BuildMessageLine().run(updateSimpleScooter, imei);
    const createModelByPaket = new FakeCreateByMessageLineContext(
      new CreateUnknown().run(),
    );
    const mockedUpdateVehicle = mock(UpdateVehicle);
    const updateVehicle = instance(mockedUpdateVehicle);
    const messageLineContext = new CreateMessageLineContext().run();

    const createByProtocolAndVersion = new CreateByProtocolAndVersion(
      messageLineContext,
    );

    const forwardLockAttribute = new ForwardToActionResponses();
    const acknowledge = new Acknowledge();
    const vehicleRepository = new FakeVehicleFileSystemRepository();

    const handleNotFirstPaket = new HandleNotFirstPaket(
      vehicleRepository,
      updateVehicle,
      createByProtocolAndVersion,
      createModelByPaket,
      forwardLockAttribute,
      acknowledge,
      logger,
    );

    await handleNotFirstPaket.run(messageLine, imei, socketId);
  });

  it("should log error when acknowledgment fails", async () => {
    const imei = "123456789012345";
    const updateSimpleScooter = new CreateUpdateSimpleScooter().run();
    const messageLine = new BuildMessageLine().run(updateSimpleScooter, imei);
    const protocolVersion = ID_0_1;
    const protocol = THE_SIMPLE_PROTOCOL;
    const connectionModule = new ConnectionModule(
      imei,
      new State(ConnectionModule.CONNECTED),
      undefined,
      new State(protocol),
      undefined,
      new State(protocolVersion),
    );
    const vehicle = new Vehicle(
      123,
      new CreateUnknown().run({
        network: new Network([connectionModule]),
      }),
      new Date(),
    );

    const socketId = "socket123";
    const createModelByPaket = new FakeCreateByMessageLineContext(
      new CreateUnknown().run(),
    );
    const mockedUpdateVehicle = mock(UpdateVehicle);
    const updateVehicle = instance(mockedUpdateVehicle);

    const messageLineContext = new CreateMessageLineContext().run();

    const createByProtocolAndVersion = new CreateByProtocolAndVersion(
      messageLineContext,
    );

    const forwardLockAttribute = new ForwardToActionResponses();
    const acknowledge = new Acknowledge(false);
    const mockedVehicleRepository = mock(VehicleFileSystemRepository);
    when(mockedVehicleRepository.findByImei(imei)).thenReturn(vehicle);

    const vehicleRepository = instance(mockedVehicleRepository);

    const handleNotFirstPaket = new HandleNotFirstPaket(
      vehicleRepository,
      updateVehicle,
      createByProtocolAndVersion,
      createModelByPaket,
      forwardLockAttribute,
      acknowledge,
      logger,
    );

    await handleNotFirstPaket.run(messageLine, imei, socketId);

    assert(
      logger.loggedMessages.includes(
        "info: Acknowledge not sentHandleNotFirstPaket",
      ),
    );
  });
});
