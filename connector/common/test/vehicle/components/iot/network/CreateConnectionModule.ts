import { THE_SIMPLE_PROTOCOL } from "the-simple-protocol/src/Protocol.ts";
import { faker } from "@faker-js/faker";

import ConnectionState from "../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import State from "../../../../../src/vehicle/State.ts";
import ConnectionModule from "../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";
import type Imei from "../../../../../src/vehicle/components/iot/network/protocol/Imei.ts";

export default class CreateConnectionModule {
  public run(options?: {
    imei?: Imei;
    state?: State<
      typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
    >;
    detectedProtocolVersion?: State<string>;
    setProtocolVersion?: State<string>;
    detectedProtocol?: State<string>;
    setProtocol?: State<string>;
  }): ConnectionModule {
    if (!options) {
      return new ConnectionModule(
        faker.phone.imei(),
        this.generateConnectionState(),
        this.generateDetectedProtocolVersion(),
        this.generateSetProtocolVersion(),
        this.generateDetectedProtocol(),
        this.generateSetProtocol(),
      );
    }

    const imei = options.imei !== undefined ? options.imei : faker.phone.imei();
    const connectionState =
      options.state !== undefined
        ? new ConnectionState(options.state)
        : this.generateConnectionState();

    const detectedProtocolVersion =
      options.detectedProtocolVersion !== undefined
        ? options.detectedProtocolVersion
        : this.generateDetectedProtocolVersion();
    const setProtocolVersion =
      options.setProtocolVersion !== undefined
        ? options.setProtocolVersion
        : this.generateSetProtocolVersion();
    const detectedProtocol =
      options.detectedProtocol !== undefined
        ? options.detectedProtocol
        : this.generateDetectedProtocol();
    const setProtocol =
      options.setProtocol !== undefined
        ? options.setProtocol
        : this.generateSetProtocol();

    return new ConnectionModule(
      imei,
      connectionState,
      detectedProtocolVersion,
      setProtocolVersion,
      detectedProtocol,
      setProtocol,
    );
  }

  private generateConnectionState(): ConnectionState {
    return new ConnectionState(
      new State<
        typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
      >(ConnectionState.CONNECTED, new Date(), undefined, new Date()),
    );
  }

  private generateDetectedProtocolVersion(): State<string> {
    return new State<string>("v0_1", new Date(), undefined, new Date());
  }
  private generateSetProtocolVersion(): State<string> {
    return new State<string>("v0_1", new Date(), undefined, new Date());
  }
  private generateDetectedProtocol(): State<string> {
    return new State<string>(
      THE_SIMPLE_PROTOCOL,
      new Date(),
      undefined,
      new Date(),
    );
  }
  private generateSetProtocol(): State<string> {
    return new State<string>(
      THE_SIMPLE_PROTOCOL,
      new Date(),
      undefined,
      new Date(),
    );
  }
}
