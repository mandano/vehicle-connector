import { State } from "../../../../../connector/common/src/vehicle/State.ts";
import { ConnectionModule } from "../../../../../connector/common/src/vehicle/components/iot/network/ConnectionModule.ts";
import { Network } from "../../../../../connector/common/src/vehicle/components/iot/network/Network.ts";
import { Position } from "../../../../../connector/common/src/vehicle/components/iot/Position.ts";
import { IoT } from "../../../../../connector/common/src/vehicle/components/iot/IoT.ts";
import { LockableScooter } from "../../../../../connector/common/src/vehicle/model/models/LockableScooter.ts";
import { Lock } from "../../../../../connector/common/src/vehicle/components/lock/Lock.ts";
import { FakeSendActionRequest } from "../../../../../connector/common/test/vehicle/model/actions/FakeSendActionRequest.ts";
import { Batteries } from "../../../../../connector/common/src/vehicle/components/energy/Batteries.ts";
import { Battery } from "../../../../../connector/common/src/vehicle/components/energy/Battery.ts";
import { Speedometer } from "../../../../../connector/common/src/vehicle/components/speedometer/Speedometer.ts";
import { Odometer } from "../../../../../connector/common/src/vehicle/components/odometer/Odometer.ts";

/**
 * Warning: only contains FakeSendActionRequest, cannot be used in connector code base like this.
 */
export class CreateLockableScooter {
  public run(options: {
    imei: string;
    protocol: string;
    protocolVersion: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
  }): LockableScooter {
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
    const position = new Position(
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

    const iot = new IoT(network, position);

    return new LockableScooter(
      network,
      new Lock(
        new FakeSendActionRequest(),
        new State(Lock.LOCKED, new Date(), undefined, new Date()),
      ),
      new Batteries([
        new Battery(new State(100, new Date()), new State(0, new Date())),
      ]),
      iot,
      new Speedometer(new State(0, new Date(), undefined, new Date())),
      new Odometer(new State(0, new Date(), undefined, new Date())),
    );
  }
}
