import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { faker } from "@faker-js/faker";

import { UpdateConnectionModules } from "../../../../../src/vehicle/model/builders/update/components/UpdateConnectionModules.ts";
import { UpdateNetwork } from "../../../../../src/vehicle/model/builders/update/components/UpdateNetwork.ts";
import { UpdateState } from "../../../../../src/vehicle/model/builders/update/components/UpdateState.ts";
import { Network } from "../../../../../src/vehicle/components/iot/network/Network.ts";
import { ConnectionModule } from "../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";
import { State } from "../../../../../src/vehicle/State.ts";

describe("UpdateNetwork", () => {
  let updateConnectionModules: UpdateConnectionModules;
  let updateNetwork: UpdateNetwork;

  beforeEach(() => {
    updateConnectionModules = new UpdateConnectionModules(new UpdateState());
    updateNetwork = new UpdateNetwork(updateConnectionModules);
  });

  it("should not update if updateBy connectionModules is empty", () => {
    const imei = faker.phone.imei();
    const connectionState = new State<
      typeof ConnectionModule.CONNECTED | typeof ConnectionModule.DISCONNECTED
    >(ConnectionModule.DISCONNECTED);

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
    const updateBy = new Network([new ConnectionModule(faker.phone.imei())]);

    updateNetwork.run(toBeUpdated, updateBy);

    assert.strictEqual(
      toBeUpdated.connectionModules,
      updateBy.connectionModules,
    );
  });

  //TODO: make run return bool to be able to test if run was executed
});
