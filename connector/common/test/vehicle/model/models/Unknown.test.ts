import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { IoT } from "../../../../src/vehicle/components/iot/IoT.ts";
import { Speedometer } from "../../../../src/vehicle/components/speedometer/Speedometer.ts";
import { Lock } from "../../../../src/vehicle/components/lock/Lock.ts";
import { Batteries } from "../../../../src/vehicle/components/energy/Batteries.ts";
import { Network } from "../../../../src/vehicle/components/iot/network/Network.ts";
import { Unknown } from "../../../../src/vehicle/model/models/Unknown.ts";
import { CreateNetwork } from "../../iot/network/CreateNetwork.ts";
import { State } from "../../../../src/vehicle/State.ts";
import { Battery } from "../../../../src/vehicle/components/energy/Battery.ts";
import { FakeSendActionRequest } from "../actions/FakeSendActionRequest.ts";
import ContainsIot from "../../../../src/vehicle/components/iot/ContainsIot.ts";
import LockState from "../../../../src/vehicle/components/lock/LockState.ts";

describe("Unknown", () => {
  let network: Network;
  let energy: Batteries;
  let iot: IoT;
  let lock: Lock;
  let speedometer: Speedometer;

  beforeEach(() => {
    network = new CreateNetwork().run();
    energy = new Batteries([new Battery(new State(0), new State(0))]);
    iot = new IoT(network);
    lock = new Lock(new FakeSendActionRequest(), new LockState(new State(Lock.LOCKED)));
    speedometer = new Speedometer(new State(0));
  });

  it("should create an instance of Unknown", () => {
    const unknown = new Unknown(energy, iot, lock, speedometer);
    assert.ok(unknown);
  });

  it("should get speedometer", () => {
    const unknown = new Unknown(undefined, undefined, undefined, speedometer);
    assert.strictEqual(unknown.speedometer, speedometer);
  });

  it("should get network", () => {
    const unknown = new Unknown(undefined, iot);
    if (ContainsIot.run(unknown) === false || unknown.ioT === undefined) {
      assert.fail("unknown should contain IoT");
    }

    assert.strictEqual(unknown.ioT.network, network);
  });
});
