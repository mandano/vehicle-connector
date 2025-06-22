import { Unknown } from "../../../../../src/vehicle/model/models/Unknown.ts";
import { CreateNetwork } from "../../../iot/network/CreateNetwork.ts";
import { Batteries } from "../../../../../src/vehicle/components/energy/Batteries.ts";
import { Battery } from "../../../../../src/vehicle/components/energy/Battery.ts";
import { State } from "../../../../../src/vehicle/State.ts";
import { IoT } from "../../../../../src/vehicle/components/iot/IoT.ts";
import { Lock } from "../../../../../src/vehicle/components/lock/Lock.ts";
import { Speedometer } from "../../../../../src/vehicle/components/speedometer/Speedometer.ts";
import { Network } from "../../../../../src/vehicle/components/iot/network/Network.ts";
import { Odometer } from "../../../../../src/vehicle/components/odometer/Odometer.ts";
import LockState from "../../../../../src/vehicle/components/lock/LockState.ts";
import Position from "../../../../../src/vehicle/components/iot/Position.ts";
import CreatePosition from "../../../iot/network/CreatePosition.ts";

export class CreateUnknown {
  public run(options?: {
    network?: Network;
    batteries?: Batteries;
    iot?: IoT;
    lock?: Lock;
    speedometer?: Speedometer;
    odometer?: Odometer;
    position?: Position;
  }): Unknown {
    const network = options?.network ?? new CreateNetwork().run();
    const position = options?.position ?? new CreatePosition().run();

    const batteries =
      options !== undefined && "batteries" in options
        ? options.batteries
        : new Batteries([new Battery(new State(0), new State(0))]);
    const iot =
      options !== undefined && "iot" in options
        ? options.iot
        : new IoT(network, position);
    const lock =
      options !== undefined && "lock" in options
        ? options.lock
        : new Lock(undefined, new LockState(new State(LockState.LOCKED)));
    const speedometer =
      options !== undefined && "speedometer" in options
        ? options.speedometer
        : new Speedometer(new State(0));
    const odometer =
      options !== undefined && "odometer" in options
        ? options.odometer
        : new Odometer(new State(0, new Date()));

    return new Unknown(batteries, iot, lock, speedometer, odometer);
  }
}

export default CreateUnknown;
