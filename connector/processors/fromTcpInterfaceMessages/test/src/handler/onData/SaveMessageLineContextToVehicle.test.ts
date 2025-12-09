import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import UpdateConnectionModules from "common/src/vehicle/model/builders/update/components/connectionModules/UpdateConnectionModules.ts";
import ConnectionState from "common/src/vehicle/components/iot/network/ConnectionState.ts";
import UpdateConnectionState from "common/src/vehicle/model/builders/update/components/connectionModule/state/UpdateConnectionState.ts";
import UpdateConnectionModule from "common/src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import CloneConnectionModule from "common/src/vehicle/components/iot/network/CloneConnectionModule.ts";
import CloneConnectionState from "common/src/vehicle/components/iot/network/CloneConnectionState.ts";
import CloneState from "common/src/vehicle/model/CloneState.ts";
import VehicleValkeyRepository from "common/src/repositories/vehicle/valkey/VehicleValkeyRepository.ts";
import { anything, instance, mock, when } from "ts-mockito";
import Hashable from "common/src/entities/Hashable.ts";
import UpdateBatteries from "common/src/vehicle/model/builders/update/components/energy/batteries/UpdateBatteries.ts";
import UpdatePosition from "common/src/vehicle/model/builders/update/components/position/UpdatePosition.ts";
import UpdateStateNoUndefined from "common/src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import ConnectionModuleToChanges from "common/src/vehicle/model/builders/update/components/connectionModule/ConnectionModuleToChanges.ts";
import PositionToChanges from "common/src/vehicle/components/iot/position/PositionToChanges.ts";
import NetworkToChanges from "common/src/vehicle/components/iot/network/NetworkToChanges.ts";
import ClonePosition from "common/src/vehicle/components/iot/position/ClonePosition.ts";
import CloneBatteries from "common/src/vehicle/model/builders/update/components/energy/batteries/CloneBatteries.js";
import CloneBattery from "common/src/vehicle/model/builders/update/components/energy/batteries/battery/CloneBattery.js";
import BatteriesToChanges from "common/src/vehicle/model/builders/update/components/energy/batteries/BatteriesToChanges.js";
import UpdateBattery from "common/src/vehicle/model/builders/update/components/energy/batteries/battery/UpdateBattery.ts";
import UpdateVoltage from "common/src/vehicle/model/builders/update/components/energy/batteries/battery/voltage/UpdateVoltage.ts";
import BatteryToChanges from "common/src/vehicle/model/builders/update/components/energy/batteries/battery/BatteryToChanges.js";
import StateToChanges from "common/src/vehicle/model/builders/update/components/state/StateToChanges.js";
import UpdateDetectedProtocolVersion from "common/src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocolVersion.js";
import UpdateSetProtocolVersion from "common/src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocolVersion.js";
import UpdateDetectedProtocol from "common/src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocol.js";
import UpdateSetProtocol from "common/src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocol.js";
import CloneIoT from "common/src/vehicle/components/iot/CloneIoT.ts";
import CloneNetwork from "common/src/vehicle/components/iot/network/CloneNetwork.ts";
import IotToChanges from "common/src/vehicle/model/builders/update/components/ioT/IotToChanges.ts";
import CloneConnectionModules from "common/src/vehicle/components/iot/network/CloneConnectionModules.ts";
import ConnectionStates from "common/src/vehicle/components/iot/network/connectionModule/connectionState/ConnectionStates.ts";
import CloneLockState from "common/src/vehicle/components/lock/CloneLockState.ts";
import LockStateToChanges from "common/src/vehicle/components/lock/LockStateToChanges.ts";
import UpdateLock from "common/src/vehicle/model/builders/update/components/lock/UpdateLock.ts";
import PublishChanges from "common/src/vehicle/model/builders/update/publish/PublishChanges.ts";
import { WorkerQueueFake } from "common/test/adapters/queue/rabbitMq/WorkerQueueFake.ts";
import UpdateState from "common/src/vehicle/model/builders/update/components/state/UpdateState.ts";
import CloneStateExt from "common/src/vehicle/model/CloneStateExt.ts";
import UpdateNoUndefined from "common/src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";
import ToBeUpdatedOriginatedAtUndefined from "common/src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "common/src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import { FakeLogger } from "common/test/logger/FakeLogger.ts";
import { Unknown } from "common/src/vehicle/model/models/Unknown.ts";
import { Network } from "common/src/vehicle/components/iot/network/Network.ts";
import { Vehicle } from "common/src/vehicle/Vehicle.ts";

import { SaveVehicle } from "../../../../src/handler/onData/SaveVehicle.ts";
import ConnectionModule from "../../../../../../common/src/vehicle/components/iot/network/ConnectionModule.ts";
import UpdateUnknown from "../../../../../../common/src/vehicle/model/builders/update/models/unknown/UpdateUnknown.ts";
import UpdateIoT from "../../../../../../common/src/vehicle/model/builders/update/components/ioT/UpdateIoT.ts";
import UpdateNetwork from "../../../../../../common/src/vehicle/model/builders/update/components/network/UpdateNetwork.ts";
import UpdateLockableScooter from "../../../../../../common/src/vehicle/model/builders/update/models/lockableScooter/UpdateLockableScooter.ts";
import UpdateLockState from "../../../../../../common/src/vehicle/model/builders/update/components/lock/UpdateLockState.ts";
import UpdateSpeedometer from "../../../../../../common/src/vehicle/model/builders/update/components/speedometer/UpdateSpeedometer.ts";
import IoT from "../../../../../../common/src/vehicle/components/iot/IoT.ts";
import CreateUnknown from "../../../../../../common/test/vehicle/model/models/create/CreateUnknown.ts";
import Update from "../../../../../../common/src/vehicle/model/builders/update/Update.ts";
import UpdateVehicle from "../../../../src/handler/onData/UpdateVehicle.ts";

describe("SaveMessageLineContextToVehicle", () => {
  let updateUnknown: UpdateUnknown;
  let updateLockableScooter: UpdateLockableScooter;

  beforeEach(() => {
    const updateStateNoUndefined = new UpdateStateNoUndefined(
      new ToBeUpdatedOriginatedAtUndefined(),
      new OriginatedAtUndefined(),
      new UpdateNoUndefined(),
    );
    const updateState = new UpdateState(
      updateStateNoUndefined,
      new StateToChanges(),
      new CloneStateExt(),
    );

    const updateConnectionState = new UpdateConnectionState(
      updateStateNoUndefined,
      new CloneConnectionState(
        new CloneState<
          typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
        >(),
      ),
    );
    const updateConnectionModules = new UpdateConnectionModules(
      new UpdateConnectionModule(
        updateConnectionState,
        new UpdateDetectedProtocol(updateStateNoUndefined),
        new UpdateDetectedProtocolVersion(updateStateNoUndefined),
        new UpdateSetProtocolVersion(),
        new UpdateSetProtocol(),
      ),
      new CloneConnectionModule(
        new CloneConnectionState(new CloneState()),
        new CloneState(),
      ),
      new ConnectionModuleToChanges(),
    );

    const updateIoT = new UpdateIoT(
      new UpdateNetwork(
        updateConnectionModules,
        new NetworkToChanges(),
        new CloneNetwork(
          new CloneConnectionModules(
            new CloneConnectionModule(
              new CloneConnectionState(new CloneState<ConnectionStates>()),
              new CloneState<string>(),
            ),
          ),
        ),
      ),
      new UpdatePosition(
        updateState,
        new ClonePosition(),
        new PositionToChanges(),
      ),
      new CloneIoT(
        new ClonePosition(),
        new CloneNetwork(
          new CloneConnectionModules(
            new CloneConnectionModule(
              new CloneConnectionState(new CloneState<ConnectionStates>()),
              new CloneState<string>(),
            ),
          ),
        ),
      ),
      new IotToChanges(),
    );
    const updateBatteries = new UpdateBatteries(
      new UpdateBattery(
        updateStateNoUndefined,
        new UpdateVoltage(updateStateNoUndefined, new StateToChanges()),
        new BatteryToChanges(),
      ),
      new CloneBatteries(new CloneBattery()),
      new BatteriesToChanges(),
    );

    const stateToChanges = new StateToChanges();
    const cloneLockState = new CloneLockState(new CloneState<string>());
    const lockStateToChanges = new LockStateToChanges(stateToChanges);
    const updateLockState = new UpdateLockState(
      updateStateNoUndefined,
      cloneLockState,
      lockStateToChanges,
    );
    const updateLock = new UpdateLock(
      updateLockState,
      cloneLockState,
      lockStateToChanges,
    );

    updateUnknown = new UpdateUnknown(updateBatteries, updateIoT);
    updateLockableScooter = new UpdateLockableScooter(
      updateBatteries,
      updateIoT,
      updateLock,
      new UpdateSpeedometer(
        updateStateNoUndefined,
        stateToChanges,
        new CloneState<number>(),
      ),
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
      new UpdateVehicle(
        vehicleRepository,
        logger,
        new Update(updateUnknown, updateLockableScooter),
        new PublishChanges(new WorkerQueueFake()),
      ),
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
      new UpdateVehicle(
        vehicleRepository,
        logger,
        new Update(updateUnknown, updateLockableScooter),
        new PublishChanges(new WorkerQueueFake()),
      ),
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
      new UpdateVehicle(
        vehicleRepository,
        logger,
        new Update(updateUnknown, updateLockableScooter),
        new PublishChanges(new WorkerQueueFake()),
      ),
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

    const mockedUpdateVehicle = mock(UpdateVehicle);

    const unknown = new CreateUnknown().run();

    when(
      mockedUpdateVehicle.run(anything(), anything(), anything()),
    ).thenReturn(Promise.resolve(true));
    const updateVehicle = instance(mockedUpdateVehicle);

    const saveMessageLineContextToVehicle = new SaveVehicle(
      vehicleRepository,
      logger,
      false,
      updateVehicle,
    );

    const result = await saveMessageLineContextToVehicle.run(unknown, imei);

    assert.strictEqual(result, vehicleId);
  });
});
