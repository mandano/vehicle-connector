import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { SaveVehicle } from "../../../../src/handler/onData/SaveVehicle.ts";
import { FakeVehicleFileSystemRepository } from "../../../../../../common/test/repositories/FakeVehicleFileSystemRepository.ts";
import { FakeLogger } from "../../../../../../common/test/logger/FakeLogger.ts";
import { Unknown } from "../../../../../../common/src/vehicle/model/models/Unknown.ts";
import { Network } from "../../../../../../common/src/vehicle/components/iot/network/Network.ts";
import { Vehicle } from "../../../../../../common/src/vehicle/Vehicle.ts";
import { Update } from "../../../../../../common/src/vehicle/model/builders/update/Update.ts";
import { ConnectionModule } from "../../../../../../common/src/vehicle/components/iot/network/ConnectionModule.ts";
import { State } from "../../../../../../common/src/vehicle/State.ts";
import { UpdateState } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdateState.ts";
import { UpdateConnectionModules } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdateConnectionModules.ts";
import { UpdateUnknown } from "../../../../../../common/src/vehicle/model/builders/update/models/UpdateUnknown.ts";
import { UpdateEnergy } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdateEnergy.ts";
import { UpdateIoT } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdateIoT.ts";
import { UpdateNetwork } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdateNetwork.ts";
import { UpdatePosition } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdatePosition.ts";
import { UpdateLockableScooter } from "../../../../../../common/src/vehicle/model/builders/update/models/UpdateLockableScooter.ts";
import { UpdateLock } from "../../../../../../common/src/vehicle/model/builders/update/components/UpdateLock.ts";
import { UpdateSpeedometer } from "../../../../../../common/src/vehicle/model/builders/update/components/speedometer/UpdateSpeedometer.ts";
import { IoT } from "../../../../../../common/src/vehicle/components/iot/IoT.ts";
import { CreateUnknown } from "../../../../../../common/test/vehicle/model/models/create/CreateUnknown.ts";
import { CreateNetwork } from "../../../../../../common/test/vehicle/iot/network/CreateNetwork.ts";
import ContainsIot from "../../../../../../common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../../../common/src/vehicle/components/iot/network/ContainsNetwork.ts";

describe("SaveMessageLineContextToVehicle", () => {
  let updateUnknown: UpdateUnknown;
  let updateLockableScooter: UpdateLockableScooter;

  beforeEach(() => {
    const updateState = new UpdateState();
    const updateConnectionModules = new UpdateConnectionModules(updateState);

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
      new UpdateLock(updateState),
      new UpdateSpeedometer(updateState),
    );
  });

  it("should create a new vehicle if it does not exist and automatic creation is allowed", () => {
    const vehicleIdOfCreatedVehicle = 12;

    const vehicleRepository = new FakeVehicleFileSystemRepository({
      createReturnValue: vehicleIdOfCreatedVehicle,
    });
    const logger = new FakeLogger();

    const saveMessageLineContextToVehicle = new SaveVehicle(
      vehicleRepository,
      logger,
      true,
      new Update(updateUnknown, updateLockableScooter),
    );
    const imei = "1234";

    const unknown = new CreateUnknown().run();

    const result = saveMessageLineContextToVehicle.run(unknown, imei);

    assert.strictEqual(result, vehicleIdOfCreatedVehicle);
  });

  it("should return undefined if vehicle model is not created", () => {
    const vehicleRepository = new FakeVehicleFileSystemRepository({
      createReturnValue: undefined,
    });
    const logger = new FakeLogger();

    const saveMessageLineContextToVehicle = new SaveVehicle(
      vehicleRepository,
      logger,
      true,
      new Update(updateUnknown, updateLockableScooter),
    );
    const imei = "1234";

    const unknown = new CreateUnknown().run();

    const result = saveMessageLineContextToVehicle.run(unknown, imei);

    assert.strictEqual(result, undefined);
  });

  it("should return undefined if vehicle does not exist and automatic creation is not allowed", () => {
    const vehicleRepository = new FakeVehicleFileSystemRepository();
    const logger = new FakeLogger();

    const saveMessageLineContextToVehicle = new SaveVehicle(
      vehicleRepository,
      logger,
      false,
      new Update(updateUnknown, updateLockableScooter),
    );
    const imei = "1234";

    const unknown = new CreateUnknown().run();

    const result = saveMessageLineContextToVehicle.run(unknown, imei);

    assert.strictEqual(result, undefined);
  });

  it("should update an existing vehicle", () => {
    const vehicleId = 12;
    const imei = "1234";

    const vehicleRepository = new FakeVehicleFileSystemRepository({
      vehicles: [
        new Vehicle(
          vehicleId,
          new Unknown(
            undefined,
            new IoT(new Network([new ConnectionModule(imei)])),
          ),
          new Date(),
        ),
      ],
    });
    const logger = new FakeLogger();

    const saveMessageLineContextToVehicle = new SaveVehicle(
      vehicleRepository,
      logger,
      false,
      new Update(updateUnknown, updateLockableScooter),
    );

    const unknown = new CreateUnknown().run();

    const result = saveMessageLineContextToVehicle.run(unknown, imei);

    assert.strictEqual(result, vehicleId);
  });

  it("first paket sets vehicle to connected state", () => {
    const vehicleId = 12;
    const imei = "1234";

    const vehicleRepository = new FakeVehicleFileSystemRepository({
      vehicles: [
        new Vehicle(
          vehicleId,
          new Unknown(
            undefined,
            new IoT(
              new Network([
                new ConnectionModule(
                  imei,
                  new State(ConnectionModule.DISCONNECTED),
                ),
              ]),
            ),
          ),
          new Date(),
        ),
      ],
    });
    const logger = new FakeLogger();

    const saveMessageLineContextToVehicle = new SaveVehicle(
      vehicleRepository,
      logger,
      true,
      new Update(updateUnknown, updateLockableScooter),
    );

    const unknown = new CreateUnknown().run({
      network: new CreateNetwork().run({
        connectionModules: [
          new ConnectionModule(imei, new State(ConnectionModule.CONNECTED)),
        ],
      }),
    });

    saveMessageLineContextToVehicle.run(unknown, imei);

    if (
      ContainsIot.run(vehicleRepository.vehicles[0].model) === false ||
      vehicleRepository.vehicles[0].model.ioT === undefined
    ) {
      return;
    }

    if (
      ContainsNetwork.run(vehicleRepository.vehicles[0].model.ioT) === false ||
      vehicleRepository.vehicles[0].model.ioT.network === undefined
    ) {
      return;
    }

    assert.strictEqual(
      vehicleRepository.vehicles[0].model.ioT.network.connectionModules[0].state
        ?.state,
      ConnectionModule.CONNECTED,
    );
  });
});
