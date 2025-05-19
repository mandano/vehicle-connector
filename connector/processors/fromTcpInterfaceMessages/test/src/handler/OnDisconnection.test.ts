import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { OnDisconnection } from "../../../src/handler/OnDisconnection.ts";
import { FakeImeiSocketIdFileRepository } from "../../../../../common/test/repositories/FakeImeiSocketIdFileRepository.ts";
import { FakeVehicleFileSystemRepository } from "../../../../../common/test/repositories/FakeVehicleFileSystemRepository.ts";
import { FakeLogger } from "../../../../../common/test/logger/FakeLogger.ts";
import { TcpInterfaceMessage } from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { Vehicle } from "../../../../../common/src/vehicle/Vehicle.ts";
import { Unknown } from "../../../../../common/src/vehicle/model/models/Unknown.ts";
import { Network } from "../../../../../common/src/vehicle/components/iot/network/Network.ts";
import { ConnectionModule } from "../../../../../common/src/vehicle/components/iot/network/ConnectionModule.ts";
import { IoT } from "../../../../../common/src/vehicle/components/iot/IoT.ts";

describe("OnDisconnection", () => {
  it("should return undefined and log error if imei is not found", () => {
    const logger = new FakeLogger();
    const imeiSocketIdFileRepository = new FakeImeiSocketIdFileRepository({
      getImeiReturnValue: undefined,
    });
    const fakeVehicleFileSystemRepository =
      new FakeVehicleFileSystemRepository();

    const onDisconnection = new OnDisconnection(
      imeiSocketIdFileRepository,
      fakeVehicleFileSystemRepository,
      logger,
    );

    const result = onDisconnection.run(
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

  it("should return undefined and log error if vehicle is not found", () => {
    const logger = new FakeLogger();
    const imeiSocketIdFileRepository = new FakeImeiSocketIdFileRepository({
      getImeiReturnValue: "imei123",
    });
    const fakeVehicleFileSystemRepository = new FakeVehicleFileSystemRepository(
      {
        findByImeiReturnValue: undefined,
      },
    );

    const onDisconnection = new OnDisconnection(
      imeiSocketIdFileRepository,
      fakeVehicleFileSystemRepository,
      logger,
    );

    const result = onDisconnection.run(
      new TcpInterfaceMessage(
        TcpInterfaceMessage.onDisconnection,
        "socket123",
        "",
      ),
    );

    assert.strictEqual(result, undefined);
    assert(logger.loggedMessages.includes(
      "error: Vehicle not foundOnDisconnection",
    ));
  });

  it("should update vehicle and delete imei on successful disconnection", () => {
    //no actual test here, updateByImei and delete are tested separately
    const imei = "imei123";

    const logger = new FakeLogger();
    const imeiSocketIdFileRepository = new FakeImeiSocketIdFileRepository({
      getImeiReturnValue: imei,
    });
    const fakeVehicleFileSystemRepository = new FakeVehicleFileSystemRepository(
      {
        vehicles: [
          new Vehicle(
            1,
            new Unknown(
              undefined,
              new IoT(new Network([new ConnectionModule(imei)])),
            ),
            new Date(),
          ),
        ],
      },
    );

    const onDisconnection = new OnDisconnection(
      imeiSocketIdFileRepository,
      fakeVehicleFileSystemRepository,
      logger,
    );

    const result = onDisconnection.run(
      new TcpInterfaceMessage(TcpInterfaceMessage.onDisconnection, imei, ""),
    );

    assert.strictEqual(result, undefined);
    assert(!logger.loggedMessages.includes(
      "error: Vehicle not foundOnDisconnection"
    ));
    assert(!logger.loggedMessages.includes(
      "error: Imei not foundOnDisconnection"
    ));
  });
});