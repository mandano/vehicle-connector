import { Network } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/network/Network.ts";
import { SimpleUpdate } from "../../SimpleUpdate.ts";
import { ConnectionModule } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/network/ConnectionModule.ts";
import { State } from "../../../../../../../../../../connector/common/src/vehicle/State.ts";
import { THE_SIMPLE_PROTOCOL } from "../../../../../../Protocol.ts";

export class NetworkBuilder {
  public build(updateSimpleScooter: SimpleUpdate): Network {
    const connectionModules: ConnectionModule[] = [];

    const protocolVersion = new State(
      updateSimpleScooter.protocolVersion,
      updateSimpleScooter.originatedAt,
      undefined,
      new Date(),
    );
    const setProtocolVersion = new State(
      updateSimpleScooter.protocolVersion,
      updateSimpleScooter.originatedAt,
      undefined,
      new Date(),
    );
    const detectedProtocol = new State(
      THE_SIMPLE_PROTOCOL,
      updateSimpleScooter.originatedAt,
      undefined,
      new Date(),
    );
    const setProtocol = new State(
      THE_SIMPLE_PROTOCOL,
      updateSimpleScooter.originatedAt,
      undefined,
      new Date(),
    );

    connectionModules.push(
      new ConnectionModule(
        updateSimpleScooter.imei,
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
