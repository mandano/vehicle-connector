import { faker } from "@faker-js/faker";

import State from "../../../../src/vehicle/State.ts";
import ConnectionModule from "../../../../src/vehicle/components/iot/network/ConnectionModule.ts";
import ConnectionState from "../../../../src/vehicle/components/iot/network/ConnectionState.ts";

export class CreateConnectionModules {
  public run(options?: { imeis?: string[] }): ConnectionModule[] {
    return [
      new ConnectionModule(
        options?.imeis?.[0] ?? faker.phone.imei(),
        new ConnectionState(
          new State(
            ConnectionState.CONNECTED,
            new Date(),
            new Date(),
            new Date(),
          ),
        ),
      ),
    ];
  }
}
