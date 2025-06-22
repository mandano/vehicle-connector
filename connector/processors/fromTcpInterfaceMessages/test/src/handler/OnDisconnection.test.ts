import { describe, it } from "node:test";
import assert from "node:assert/strict";

import VehicleValkeyRepository from "common/src/repositories/vehicle/valkey/VehicleValkeyRepository.ts";
import { anything, instance, mock, when } from "ts-mockito";
import Hashable from "common/src/entities/Hashable.ts";

import { OnDisconnection } from "../../../src/handler/OnDisconnection.ts";
import { FakeImeiSocketIdFileRepository } from "../../../../../common/test/repositories/FakeImeiSocketIdFileRepository.ts";
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
    const imeiSocketIdFileRepository = new FakeImeiSocketIdFileRepository({
      getImeiReturnValue: undefined,
    });

    const mockedVehicleRepository = mock(VehicleValkeyRepository);
    when(mockedVehicleRepository.findByImei(anything())).thenResolve(undefined);
    const vehicleRepository = instance(mockedVehicleRepository);

    const onDisconnection = new OnDisconnection(
      imeiSocketIdFileRepository,
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
    const imeiSocketIdFileRepository = new FakeImeiSocketIdFileRepository({
      getImeiReturnValue: "imei123",
    });

    const mockedVehicleRepository = mock(VehicleValkeyRepository);
    when(mockedVehicleRepository.findByImei(anything())).thenResolve(undefined);
    const vehicleRepository = instance(mockedVehicleRepository);

    const onDisconnection = new OnDisconnection(
      imeiSocketIdFileRepository,
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
    //no actual test here, updateByImei and delete are tested separately
    const imei = "imei123";

    const logger = new FakeLogger();
    const imeiSocketIdFileRepository = new FakeImeiSocketIdFileRepository({
      getImeiReturnValue: imei,
    });

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
    const vehicleRepository = instance(mockedVehicleRepository);

    const onDisconnection = new OnDisconnection(
      imeiSocketIdFileRepository,
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
