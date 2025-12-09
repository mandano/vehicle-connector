import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { faker } from "@faker-js/faker";

import UpdateConnectionModules from "../../../../../src/vehicle/model/builders/update/components/connectionModules/UpdateConnectionModules.ts";
import UpdateNetwork from "../../../../../src/vehicle/model/builders/update/components/network/UpdateNetwork.ts";
import Network from "../../../../../src/vehicle/components/iot/network/Network.ts";
import ConnectionModule from "../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";
import State from "../../../../../src/vehicle/State.ts";
import ConnectionState from "../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import UpdateConnectionState from "../../../../../src/vehicle/model/builders/update/components/connectionModule/state/UpdateConnectionState.ts";
import UpdateConnectionModule from "../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import CloneConnectionState from "../../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import CloneState from "../../../../../src/vehicle/model/CloneState.ts";
import CloneConnectionModule from "../../../../../src/vehicle/components/iot/network/CloneConnectionModule.ts";
import ConnectionModuleToChanges from "../../../../../src/vehicle/model/builders/update/components/connectionModule/ConnectionModuleToChanges.ts";
import UpdateStateNoUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import UpdateDetectedProtocol from "../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocol.ts";
import UpdateDetectedProtocolVersion from "../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocolVersion.ts";
import UpdateSetProtocolVersion from "../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocolVersion.ts";
import UpdateSetProtocol from "../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocol.ts";
import ToBeUpdatedOriginatedAtUndefined
  from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";
import NetworkToChanges from "../../../../../src/vehicle/components/iot/network/NetworkToChanges.ts";
import CloneNetwork from "../../../../../src/vehicle/components/iot/network/CloneNetwork.ts";
import CloneConnectionModules from "../../../../../src/vehicle/components/iot/network/CloneConnectionModules.ts";
import ConnectionStates
  from "../../../../../src/vehicle/components/iot/network/connectionModule/connectionState/ConnectionStates.ts";

describe("UpdateNetwork", () => {
  let updateConnectionModules: UpdateConnectionModules;
  let updateNetwork: UpdateNetwork;

  beforeEach(() => {
    const updateStateNoUndefined = new UpdateStateNoUndefined(
      new ToBeUpdatedOriginatedAtUndefined(),
      new OriginatedAtUndefined(),
      new UpdateNoUndefined(),
    );

    const updateConnectionState = new UpdateConnectionState(
      updateStateNoUndefined,
      new CloneConnectionState(
        new CloneState<
          typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
        >(),
      ),
    );
    updateConnectionModules = new UpdateConnectionModules(
      new UpdateConnectionModule(
        updateConnectionState,
        new UpdateDetectedProtocol(updateStateNoUndefined),
        new UpdateDetectedProtocolVersion(updateStateNoUndefined),
        new UpdateSetProtocolVersion(),
        new UpdateSetProtocol(),
      ),
      new CloneConnectionModule(
        new CloneConnectionState(new CloneState()),
        new CloneState(),
      ),
      new ConnectionModuleToChanges(),
    );
    updateNetwork = new UpdateNetwork(updateConnectionModules, new NetworkToChanges(), new CloneNetwork(
      new CloneConnectionModules(
        new CloneConnectionModule(
          new CloneConnectionState(new CloneState<ConnectionStates>()),
          new CloneState<ConnectionStates>(),
        ),
      ),
    ),);
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

    const updateResult = updateNetwork.run(toBeUpdated, updateBy);

    assert.strictEqual(updateResult.new!.connectionModules[0].imei, imei);
    assert.strictEqual(
      updateResult.new!.connectionModules[0].state?.state,
      connectionState.state,
    );
  });

  it("should update if toBeUpdated connectionModules is empty", () => {
    const toBeUpdated = new Network([]);
    const updateBy = new Network([
      new ConnectionModule(faker.phone.imei(), undefined),
    ]);

    const updateNetworkResult = updateNetwork.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(
      updateNetworkResult.new!.connectionModules,
      updateBy.connectionModules,
    );
    assert.notStrictEqual(
      toBeUpdated.connectionModules,
      updateBy.connectionModules,
    );
  });
});
