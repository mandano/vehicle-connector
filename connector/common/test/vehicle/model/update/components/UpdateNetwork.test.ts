import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { faker } from "@faker-js/faker";

import UpdateConnectionModules from "../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModules.ts";
import { UpdateNetwork } from "../../../../../src/vehicle/model/builders/update/components/UpdateNetwork.ts";
import { UpdateState } from "../../../../../src/vehicle/model/builders/update/components/UpdateState.ts";
import { Network } from "../../../../../src/vehicle/components/iot/network/Network.ts";
import { ConnectionModule } from "../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";
import { State } from "../../../../../src/vehicle/State.ts";
import ConnectionState from "../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import UpdateConnectionState from "../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionState.js";
import UpdateConnectionModule
  from "../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.js";
import CloneConnectionState from "../../../../../src/vehicle/components/iot/network/CloneConnectionState.js";
import CloneState from "../../../../../src/vehicle/model/CloneState.js";
import CloneConnectionModule from "../../../../../src/vehicle/components/iot/network/CloneConnectionModule.js";

describe("UpdateNetwork", () => {
  let updateConnectionModules: UpdateConnectionModules;
  let updateNetwork: UpdateNetwork;

  beforeEach(() => {
    const updateState = new UpdateState();

    const updateConnectionState = new UpdateConnectionState(
      updateState,
      new CloneConnectionState(
        new CloneState<
          typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
        >(),
      ),
    );
    updateConnectionModules = new UpdateConnectionModules(
      new UpdateConnectionModule(updateState, updateConnectionState),
      new CloneConnectionModule(
        new CloneConnectionState(new CloneState()),
        new CloneState(),
      ),
    );
    updateNetwork = new UpdateNetwork(updateConnectionModules);
  });

  it("should not update if updateBy connectionModules is empty", () => {
    const imei = faker.phone.imei();
    const connectionState = new ConnectionState(
      new State<
        typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
      >(ConnectionState.DISCONNECTED),
    );

    const toBeUpdated = new Network([
      new ConnectionModule(imei, connectionState),
    ]);
    const updateBy = new Network([]);

    updateNetwork.run(toBeUpdated, updateBy);

    assert.strictEqual(toBeUpdated.connectionModules[0].imei, imei);
    assert.strictEqual(
      toBeUpdated.connectionModules[0].state?.state,
      connectionState.state,
    );
  });

  it("should update if toBeUpdated connectionModules is empty", () => {
    const toBeUpdated = new Network([]);
    const updateBy = new Network([
      new ConnectionModule(faker.phone.imei(), undefined),
    ]);

    updateNetwork.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(
      toBeUpdated.connectionModules,
      updateBy.connectionModules,
    );
    assert.notStrictEqual(
      toBeUpdated.connectionModules,
      updateBy.connectionModules,
    );
  });

  //TODO: make run return bool to be able to test if run was executed
});
