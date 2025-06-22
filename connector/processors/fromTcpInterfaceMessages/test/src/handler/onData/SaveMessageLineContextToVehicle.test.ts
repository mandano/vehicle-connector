import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import UpdateConnectionModules from "common/src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModules.ts";
import ConnectionState from "common/src/vehicle/components/iot/network/ConnectionState.ts";
import UpdateConnectionState from "common/src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionState.ts";
import UpdateConnectionModule from "common/src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import CloneConnectionModule from "common/src/vehicle/components/iot/network/CloneConnectionModule.ts";
import CloneConnectionState from "common/src/vehicle/components/iot/network/CloneConnectionState.ts";
import CloneState from "common/src/vehicle/model/CloneState.ts";
import VehicleValkeyRepository from "common/src/repositories/vehicle/valkey/VehicleValkeyRepository.ts";
import { anything, instance, mock, when } from "ts-mockito";
import Hashable from "common/src/entities/Hashable.ts";

import { SaveVehicle } from "../../../../src/handler/onData/SaveVehicle.ts";
import { FakeLogger } from "../../../../../../common/test/logger/FakeLogger.ts";
import { Unknown } from "../../../../../../common/src/vehicle/model/models/Unknown.ts";
import { Network } from "../../../../../../common/src/vehicle/components/iot/network/Network.ts";
import { Vehicle } from "../../../../../../common/src/vehicle/Vehicle.ts";
import { ConnectionModule } from "../../../../../../common/src/vehicle/components/iot/network/ConnectionModule.ts";
import { UpdateState } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdateState.ts";
import { UpdateUnknown } from "../../../../../../common/src/vehicle/model/builders/update/models/UpdateUnknown.ts";
import { UpdateEnergy } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdateEnergy.ts";
import { UpdateIoT } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdateIoT.ts";
import { UpdateNetwork } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdateNetwork.ts";
import { UpdatePosition } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdatePosition.ts";
import { UpdateLockableScooter } from "../../../../../../common/src/vehicle/model/builders/update/models/UpdateLockableScooter.ts";
import { UpdateLockState } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdateLockState.ts";
import { UpdateSpeedometer } from "../../../../../../common/src/vehicle/model/builders/update/components/speedometer/UpdateSpeedometer.ts";
import { IoT } from "../../../../../../common/src/vehicle/components/iot/IoT.ts";
import { CreateUnknown } from "../../../../../../common/test/vehicle/model/models/create/CreateUnknown.ts";
import Update from "../../../../../../common/src/vehicle/model/builders/update/Update.ts";

describe("SaveMessageLineContextToVehicle", () => {
  let updateUnknown: UpdateUnknown;
  let updateLockableScooter: UpdateLockableScooter;

  beforeEach(() => {
    const updateState = new UpdateState();

    const updateConnectionState = new UpdateConnectionState(
      updateState,
      new CloneConnectionState(
        new CloneState<
          typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
        >(),
      ),
    );
    const updateConnectionModules = new UpdateConnectionModules(
      new UpdateConnectionModule(updateState, updateConnectionState),
      new CloneConnectionModule(
        new CloneConnectionState(new CloneState()),
        new CloneState(),
      ),
    );

    updateUnknown = new UpdateUnknown(
      new UpdateEnergy(updateState),
      updateConnectionModules,
      new UpdateIoT(
        new UpdateNetwork(updateConnectionModules),
        new UpdatePosition(updateState),
      ),
    );
    updateLockableScooter = new UpdateLockableScooter(
      new UpdateEnergy(updateState),
      updateConnectionModules,
      new UpdateIoT(
        new UpdateNetwork(updateConnectionModules),
        new UpdatePosition(updateState),
      ),
      new UpdateLockState(updateState),
      new UpdateSpeedometer(updateState),
    );
  });

  it("should create a new vehicle if it does not exist and automatic creation is allowed", async () => {
    const vehicleIdOfCreatedVehicle = 12;

    const logger = new FakeLogger();
    const mockedVehicleRepository = mock(VehicleValkeyRepository);
    when(mockedVehicleRepository.findByImei(anything())).thenResolve(undefined);
    when(mockedVehicleRepository.create(anything())).thenResolve(
      vehicleIdOfCreatedVehicle,
    );
    const vehicleRepository = instance(mockedVehicleRepository);

    const saveMessageLineContextToVehicle = new SaveVehicle(
      vehicleRepository,
      logger,
      true,
      new Update(updateUnknown, updateLockableScooter),
    );
    const imei = "1234";

    const unknown = new CreateUnknown().run();

    const result = await saveMessageLineContextToVehicle.run(unknown, imei);

    assert.strictEqual(result, vehicleIdOfCreatedVehicle);
  });

  it("should return undefined if vehicle model is not created", async () => {
    const logger = new FakeLogger();

    const mockedVehicleRepository = mock(VehicleValkeyRepository);
    when(mockedVehicleRepository.findByImei(anything())).thenResolve(undefined);
    when(mockedVehicleRepository.create(anything())).thenResolve(undefined);
    const vehicleRepository = instance(mockedVehicleRepository);

    const saveMessageLineContextToVehicle = new SaveVehicle(
      vehicleRepository,
      logger,
      true,
      new Update(updateUnknown, updateLockableScooter),
    );
    const imei = "1234";

    const unknown = new CreateUnknown().run();

    const result = await saveMessageLineContextToVehicle.run(unknown, imei);

    assert.strictEqual(result, undefined);
  });

  it("should return undefined if vehicle does not exist and automatic creation is not allowed", async () => {
    const logger = new FakeLogger();

    const mockedVehicleRepository = mock(VehicleValkeyRepository);
    when(mockedVehicleRepository.findByImei(anything())).thenResolve(undefined);

    const vehicleRepository = instance(mockedVehicleRepository);

    const saveMessageLineContextToVehicle = new SaveVehicle(
      vehicleRepository,
      logger,
      false,
      new Update(updateUnknown, updateLockableScooter),
    );
    const imei = "1234";

    const unknown = new CreateUnknown().run();

    const result = await saveMessageLineContextToVehicle.run(unknown, imei);

    assert.strictEqual(result, undefined);
  });

  it("should update an existing vehicle", async () => {
    const vehicleId = 12;
    const imei = "1234";

    const logger = new FakeLogger();
    const mockedVehicleRepository = mock(VehicleValkeyRepository);
    when(mockedVehicleRepository.findByImei(anything())).thenResolve(
      new Hashable<Vehicle>(
        "lala",
        new Vehicle(
          vehicleId,
          new Unknown(
            undefined,
            new IoT(new Network([new ConnectionModule(imei, undefined)])),
          ),
          new Date(),
        ),
      ),
    );
    when(
      mockedVehicleRepository.updateByImei(anything(), anything(), anything()),
    ).thenResolve(true);

    const vehicleRepository = instance(mockedVehicleRepository);

    const mockedUpdate = mock(Update);

    const unknown = new CreateUnknown().run();
    when(mockedUpdate.run(anything(), anything())).thenReturn(unknown);
    const update = instance(mockedUpdate);

    const saveMessageLineContextToVehicle = new SaveVehicle(
      vehicleRepository,
      logger,
      false,
      update,
    );

    const result = await saveMessageLineContextToVehicle.run(unknown, imei);

    assert.strictEqual(result, vehicleId);
  });
});
