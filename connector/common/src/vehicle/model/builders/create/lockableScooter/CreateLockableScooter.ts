import { State } from "../../../../State.ts";
import { ConnectionModule } from "../../../../components/iot/network/ConnectionModule.ts";
import { Network } from "../../../../components/iot/network/Network.ts";
import { Position } from "../../../../components/iot/Position.ts";
import { IoT } from "../../../../components/iot/IoT.ts";
import { LockableScooter } from "../../../models/LockableScooter.ts";
import { Lock } from "../../../../components/lock/Lock.ts";
import { FakeSendActionRequest } from "../../../../../../test/vehicle/model/actions/FakeSendActionRequest.ts";
import { Batteries } from "../../../../components/energy/Batteries.ts";
import { Battery } from "../../../../components/energy/Battery.ts";
import { Speedometer } from "../../../../components/speedometer/Speedometer.ts";
import { Odometer } from "../../../../components/odometer/Odometer.ts";

import Options from "./Options.ts";

export class CreateLockableScooter {
  // TODO: proper validation of option attributes needed
  public run(options: Options): LockableScooter {
    const connectionState = new State<
      typeof ConnectionModule.DISCONNECTED | typeof ConnectionModule.CONNECTED
    >(ConnectionModule.DISCONNECTED, new Date(), undefined, new Date());

    const protocolVersion = new State(
      options["protocolVersion"],
      new Date(),
      undefined,
      new Date(),
    );

    const protocol = new State(
      options["protocol"],
      new Date(),
      undefined,
      new Date(),
    );

    const network = new Network([
      new ConnectionModule(
        options["imei"],
        connectionState,
        protocolVersion,
        protocolVersion,
        protocol,
        protocol,
      ),
    ]);

    let position;
    if (options["coordinate"] !== undefined) {
      position = new Position(
        new State<number>(
          options["coordinate"]["latitude"],
          new Date(),
          undefined,
          new Date(),
        ),
        new State<number>(
          options["coordinate"]["longitude"],
          new Date(),
          undefined,
          new Date(),
        ),
        new Date(),
        undefined,
      );
    }

    const iot = new IoT(network, position);

    let lock = options["lock"];

    if (lock === undefined) {
      lock = new Lock(
        new FakeSendActionRequest(),
        new State(Lock.UNLOCKED, new Date(), undefined, new Date()),
      );
    }

    let batteries, speedometer, odometer;
    if (options["initWithDefaultValues"] === true) {
      batteries = new Batteries([
        new Battery(new State(100, new Date()), new State(0, new Date())),
      ]);
      speedometer = new Speedometer(
        new State(0, new Date(), undefined, new Date()),
      );
      odometer = new Odometer(
        new State(0, new Date(), undefined, new Date()),
      );
    }

    return new LockableScooter(
      network,
      lock,
      batteries,
      iot,
      speedometer,
      odometer
    );
  }
}
