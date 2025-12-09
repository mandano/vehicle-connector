import assert from "assert";
import { beforeEach, describe, it } from "node:test";

import { faker } from "@faker-js/faker";

import UpdateConnectionModule from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import UpdateConnectionState from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/state/UpdateConnectionState.ts";
import ConnectionModule from "../../../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";
import Imei from "../../../../../../../src/vehicle/components/iot/network/protocol/Imei.ts";
import CreateState from "../../../../../CreateState.ts";
import ConnectionState from "../../../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import UpdateDetectedProtocol from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocol.ts";
import UpdateDetectedProtocolVersion from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocolVersion.ts";
import UpdateSetProtocolVersion from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocol.ts";
import UpdateSetProtocol from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocol.ts";
import CloneConnectionState from "../../../../../../../src/vehicle/components/iot/network/CloneConnectionState.js";
import CloneState from "../../../../../../../src/vehicle/model/CloneState.ts";
import ConnectionStates from "../../../../../../../src/vehicle/components/iot/network/connectionModule/connectionState/ConnectionStates.js";
import UpdateStateNoUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import ToBeUpdatedOriginatedAtUndefined
  from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined
  from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";

describe("UpdateConnectionModules", () => {
  let updateState: UpdateStateNoUndefined;
  let cloneConnectionState: CloneConnectionState;
  let updateConnectionModule: UpdateConnectionModule;

  let imei: Imei;

  beforeEach(() => {
    updateState = new UpdateStateNoUndefined(
      new ToBeUpdatedOriginatedAtUndefined(),
      new OriginatedAtUndefined(),
      new UpdateNoUndefined(),
    );
    cloneConnectionState = new CloneConnectionState(
      new CloneState<ConnectionStates>(),
    );

    updateConnectionModule = new UpdateConnectionModule(
      new UpdateConnectionState(updateState, cloneConnectionState),
      new UpdateDetectedProtocol(updateState),
      new UpdateDetectedProtocolVersion(updateState),
      new UpdateSetProtocolVersion(),
      new UpdateSetProtocol(),
    );
    imei = faker.phone.imei();
  });

  it("should update connectionState", () => {
    const detectedProtocolVersionToBeUpdated = new CreateState<string>().run(
      "v1",
    );
    const detectedProtocolVersionUpdateBy = new CreateState<string>().run("v2");

    const detectedProtocolToBeUpdated = new CreateState<string>().run(
      "oldProto",
    );
    const detectedProtocolUpdateBy = new CreateState<string>().run("newProto");

    const originatedAt = new Date();
    const originatedAtPlusSecond = new Date(originatedAt.getTime() + 1000);

    const connectionStateToBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
        originatedAt,
      ),
    );
    const connectionStateUpdateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
        originatedAtPlusSecond,
      ),
    );

    const toBeUpdated = new ConnectionModule(
      imei,
      connectionStateToBeUpdated,
      detectedProtocolVersionToBeUpdated,
      undefined,
      detectedProtocolToBeUpdated,
    );
    const updateBy = new ConnectionModule(
      imei,
      connectionStateUpdateBy,
      detectedProtocolVersionUpdateBy,
      undefined,
      detectedProtocolUpdateBy,
    );

    const updateConnectionModuleResult = updateConnectionModule.run(
      toBeUpdated,
      updateBy,
    );

    // should be not same reference
    assert.notStrictEqual(
      updateConnectionModuleResult.new.state,
      updateBy.state,
    );
    assert.deepStrictEqual(
      updateConnectionModuleResult.new.state?.state.state,
      updateBy.state?.state.state,
    );
  });

  it("should update connectionState - changes are returned", () => {
    const detectedProtocolVersionToBeUpdated = new CreateState<string>().run(
      "v1",
    );
    const detectedProtocolVersionUpdateBy = new CreateState<string>().run("v2");

    const detectedProtocolToBeUpdated = new CreateState<string>().run(
      "oldProto",
    );
    const detectedProtocolUpdateBy = new CreateState<string>().run("newProto");

    const originatedAt = new Date();
    const originatedAtPlusSecond = new Date(originatedAt.getTime() + 1000);

    const connectionStateToBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
        originatedAt,
      ),
    );
    const connectionStateUpdateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
        originatedAtPlusSecond,
      ),
    );

    const toBeUpdated = new ConnectionModule(
      imei,
      connectionStateToBeUpdated,
      detectedProtocolVersionToBeUpdated,
      undefined,
      detectedProtocolToBeUpdated,
    );
    const updateBy = new ConnectionModule(
      imei,
      connectionStateUpdateBy,
      detectedProtocolVersionUpdateBy,
      undefined,
      detectedProtocolUpdateBy,
    );

    const updateConnectionModuleResult = updateConnectionModule.run(
      toBeUpdated,
      updateBy,
    );

    assert.strictEqual(
      updateConnectionModuleResult.changes?.state?.state?.state,
      updateBy.state?.state.state,
    );
    assert.strictEqual(
      updateConnectionModuleResult.changes?.state?.state?.originatedAt,
      updateBy.state?.state.originatedAt?.toISOString(),
    );
    assert.ok(updateConnectionModuleResult.changes?.state?.state?.updatedAt);
  });
});
