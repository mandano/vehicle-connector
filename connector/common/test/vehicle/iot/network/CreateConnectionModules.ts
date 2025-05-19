import { faker } from "@faker-js/faker";

import { State } from "../../../../src/vehicle/State.ts";
import { ConnectionModule } from "../../../../src/vehicle/components/iot/network/ConnectionModule.ts";

export class CreateConnectionModules {
  public run(options?: {
    imeis?: string[]
  }): ConnectionModule[] {
    return [
      new ConnectionModule(
        options?.imeis?.[0] ?? faker.phone.imei(),
        new State(
          ConnectionModule.CONNECTED,
          new Date(),
          new Date(),
          new Date(),
        ),
      ),
    ];
  }
}
