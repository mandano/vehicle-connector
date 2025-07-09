import { describe, it } from "node:test";
import assert from "node:assert/strict";

import VehicleValkeyRepository from "common/src/repositories/vehicle/valkey/VehicleValkeyRepository.ts";
import { anything, instance, mock, when } from "ts-mockito";
import Hashable from "common/src/entities/Hashable.ts";
import ImeiSocketIdValkeyRepository from "common/src/repositories/imeiSocketId/ImeiSocketIdValkeyRepository.ts";

import { OnDisconnection } from "../../../src/handler/OnDisconnection.ts";
import { FakeLogger } from "../../../../../common/test/logger/FakeLogger.ts";
import { TcpInterfaceMessage } from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { Vehicle } from "../../../../../common/src/vehicle/Vehicle.ts";
import { Unknown } from "../../../../../common/src/vehicle/model/models/Unknown.ts";
import { Network } from "../../../../../common/src/vehicle/components/iot/network/Network.ts";
import { ConnectionModule } from "../../../../../common/src/vehicle/components/iot/network/ConnectionModule.ts";
import { IoT } from "../../../../../common/src/vehicle/components/iot/IoT.ts";

describe("OnDisconnection", () => {
  it("should return undefined and log error if imei is not found", async () => {
    const logger = new FakeLogger();

    const mockedVehicleRepository = mock(VehicleValkeyRepository);
    when(mockedVehicleRepository.findByImei(anything())).thenResolve(undefined);
    const vehicleRepository = instance(mockedVehicleRepository);

    const mockedImeiSocketIdValkeyRepository = mock(ImeiSocketIdValkeyRepository);
    when(mockedImeiSocketIdValkeyRepository.getImeiInSocketIdKey(anything())).thenResolve(undefined)
    const imeiSocketIdValkeyRepository = instance(mockedImeiSocketIdValkeyRepository);

    const onDisconnection = new OnDisconnection(
      imeiSocketIdValkeyRepository,
      vehicleRepository,
      logger,
    );

    const result = await onDisconnection.run(
      new TcpInterfaceMessage(
        TcpInterfaceMessage.onDisconnection,
        "socket123",
        "",
      ),
    );

    assert.strictEqual(result, undefined);
    assert(
      logger.loggedMessages.includes("error: Imei not foundOnDisconnection"),
    );
  });

  it("should return undefined and log error if vehicle is not found", async () => {
    const logger = new FakeLogger();

    const mockedVehicleRepository = mock(VehicleValkeyRepository);
    when(mockedVehicleRepository.findByImei(anything())).thenResolve(undefined);
    const vehicleRepository = instance(mockedVehicleRepository);

    const mockedImeiSocketIdValkeyRepository = mock(ImeiSocketIdValkeyRepository);
    when(mockedImeiSocketIdValkeyRepository.getImeiInSocketIdKey(anything())).thenResolve("imei123")
    const imeiSocketIdValkeyRepository = instance(mockedImeiSocketIdValkeyRepository);

    const onDisconnection = new OnDisconnection(
      imeiSocketIdValkeyRepository,
      vehicleRepository,
      logger,
    );

    const result = await onDisconnection.run(
      new TcpInterfaceMessage(
        TcpInterfaceMessage.onDisconnection,
        "socket123",
        "",
      ),
    );

    assert.strictEqual(result, undefined);
    assert(
      logger.loggedMessages.includes("error: Vehicle not foundOnDisconnection"),
    );
  });

  it("should update vehicle and delete imei on successful disconnection", async () => {
    // TODO: no actual test here, updateByImei and delete are tested separately
    const imei = "imei123";

    const logger = new FakeLogger();

    const mockedImeiSocketIdValkeyRepository = mock(ImeiSocketIdValkeyRepository);
    when(mockedImeiSocketIdValkeyRepository.getImeiInSocketIdKey(anything())).thenResolve(imei)
    when(mockedImeiSocketIdValkeyRepository.delete(anything())).thenResolve(true);

    const imeiSocketIdValkeyRepository = instance(mockedImeiSocketIdValkeyRepository);

    const mockedVehicleRepository = mock(VehicleValkeyRepository);
    when(mockedVehicleRepository.findByImei(anything())).thenResolve(
      new Hashable<Vehicle>(
        "lala",
        new Vehicle(
          1,
          new Unknown(
            undefined,
            new IoT(new Network([new ConnectionModule(imei, undefined)])),
          ),
          new Date(),
        ),
      ),
    );
    when(mockedVehicleRepository.updateByImei(anything(), anything(), anything())).thenResolve(true);
    const vehicleRepository = instance(mockedVehicleRepository);

    const onDisconnection = new OnDisconnection(
      imeiSocketIdValkeyRepository,
      vehicleRepository,
      logger,
    );

    const result = await onDisconnection.run(
      new TcpInterfaceMessage(TcpInterfaceMessage.onDisconnection, imei, ""),
    );

    assert.strictEqual(result, undefined);
    assert(
      !logger.loggedMessages.includes(
        "error: Vehicle not foundOnDisconnection",
      ),
    );
    assert(
      !logger.loggedMessages.includes("error: Imei not foundOnDisconnection"),
    );
  });
});
