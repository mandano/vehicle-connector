import { Network } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/network/Network.ts";
import { ConnectionModule } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/network/ConnectionModule.ts";
import { State } from "../../../../../../../../../../connector/common/src/vehicle/State.ts";
import { THE_SIMPLE_PROTOCOL } from "../../../../../../Protocol.ts";
import Lock from "../../Lock.ts";

export class NetworkBuilder {
  public build(lock: Lock): Network {
    const connectionModules: ConnectionModule[] = [];

    const protocolVersion = new State(
      lock.protocolVersion,
      lock.state.originatedAt,
      undefined,
      new Date(),
    );
    const setProtocolVersion = new State(
      lock.protocolVersion,
      lock.state.originatedAt,
      undefined,
      new Date(),
    );
    const detectedProtocol = new State(
      THE_SIMPLE_PROTOCOL,
      lock.state.originatedAt,
      undefined,
      new Date(),
    );
    const setProtocol = new State(
      THE_SIMPLE_PROTOCOL,
      lock.state.originatedAt,
      undefined,
      new Date(),
    );

    connectionModules.push(
      new ConnectionModule(
        lock.imei,
        undefined,
        protocolVersion,
        setProtocolVersion,
        detectedProtocol,
        setProtocol,
      ),
    );

    return new Network(connectionModules);
  }
}
