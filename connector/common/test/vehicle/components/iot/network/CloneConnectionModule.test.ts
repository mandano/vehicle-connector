import { describe, it } from "node:test";
import assert from "assert";

import { faker } from "@faker-js/faker";
import { THE_SIMPLE_PROTOCOL } from "the-simple-protocol/src/Protocol.ts";

import ConnectionState from "../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import CloneConnectionModule from "../../../../../src/vehicle/components/iot/network/CloneConnectionModule.ts";
import CloneConnectionState from "../../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import CloneState from "../../../../../src/vehicle/model/CloneState.ts";
import State from "../../../../../src/vehicle/State.ts";

import CreateConnectionModule from "./CreateConnectionModule.ts";

describe("CloneConnectionModule", () => {
  it("clones", () => {
    const connectionStateModule = new CreateConnectionModule().run({
      imei: faker.phone.imei(),
      state: new State<
        typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
      >(ConnectionState.CONNECTED, new Date(), undefined, new Date()),
      detectedProtocolVersion: new State<string>(
        "v0_1",
        new Date(),
        undefined,
        new Date(),
      ),
      setProtocolVersion: new State<string>(
        "v0_1",
        new Date(),
        undefined,
        new Date(),
      ),
      detectedProtocol: new State<string>(
        THE_SIMPLE_PROTOCOL,
        new Date(),
        undefined,
        new Date(),
      ),
      setProtocol: new State<string>(
        THE_SIMPLE_PROTOCOL,
        new Date(),
        undefined,
        new Date(),
      ),
    });

    const cloneConnectionState = new CloneConnectionState(
      new CloneState<
        typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
      >(),
    );

    const cloneConnectionModule = new CloneConnectionModule(
      cloneConnectionState,
      new CloneState<string>(),
    );
    const clonedConnectionModule = cloneConnectionModule.run(
      connectionStateModule,
    );

    assert.deepStrictEqual(clonedConnectionModule, connectionStateModule);
    assert.notStrictEqual(clonedConnectionModule, connectionStateModule);
  });
});
