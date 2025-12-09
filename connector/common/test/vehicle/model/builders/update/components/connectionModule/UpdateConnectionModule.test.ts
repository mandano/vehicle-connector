import assert from "assert";
import { beforeEach, describe, it } from "node:test";

import { mock, instance, when } from "ts-mockito";
import { faker } from "@faker-js/faker";

import UpdateConnectionModule from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import UpdateConnectionState from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/state/UpdateConnectionState.ts";
import ConnectionModule from "../../../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";
import Imei from "../../../../../../../src/vehicle/components/iot/network/protocol/Imei.ts";
import CreateState from "../../../../../CreateState.ts";
import ConnectionState from "../../../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import State from "../../../../../../../src/vehicle/State.ts";
import UpdateConnectionStateResult from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/state/UpdateConnectionStateResult.ts";
import UpdateStateResult from "../../../../../../../src/vehicle/model/builders/update/components/state/UpdateStateResult.ts";
import UpdateDetectedProtocol from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocol.ts";
import UpdateDetectedProtocolVersion from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocolVersion.ts";
import UpdateSetProtocolVersion from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocol.ts";
import UpdateSetProtocol from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocol.ts";
import StateDtoChanges from "../../../../../../../src/vehicle/components/state/StateDtoChanges.ts";
import PartialConnectionStateDto from "../../../../../../../src/vehicle/components/iot/network/connectionModule/connectionState/PartialConnectionStateDto.ts";
import PartialConnectionModuleDto from "../../../../../../../src/vehicle/components/iot/network/connectionModule/PartialConnectionModuleDto.ts";
import UpdateStateNoUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import UpdateStateResultNoUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateResultNoUndefined.ts";

describe("UpdateConnectionModule", () => {
  let updateState: UpdateStateNoUndefined;
  let updateConnectionState: UpdateConnectionState;
  let updateConnectionModule: UpdateConnectionModule;
  let updateDetectedProtocol: UpdateDetectedProtocol;
  let updateDetectedProtocolVersion: UpdateDetectedProtocolVersion;
  let updateSetProtocolVersion: UpdateSetProtocolVersion;
  let updateSetProtocol: UpdateSetProtocol;

  let imei: Imei;

  beforeEach(() => {
    updateState = mock(UpdateStateNoUndefined);
    updateConnectionState = mock(UpdateConnectionState);

    updateDetectedProtocol = mock(UpdateDetectedProtocol);
    updateDetectedProtocolVersion = mock(UpdateDetectedProtocolVersion);
    updateSetProtocolVersion = mock(UpdateSetProtocolVersion);
    updateSetProtocol = mock(UpdateSetProtocol);

    updateConnectionModule = new UpdateConnectionModule(
      instance(updateConnectionState),
      instance(updateDetectedProtocol),
      instance(updateDetectedProtocolVersion),
      instance(updateSetProtocolVersion),
      instance(updateSetProtocol),
    );
    imei = faker.phone.imei();
  });

  it("should update connectionState", () => {
    const detectedProtocolVersionToBeUpdated = new CreateState<string>().run(
      "v1",
    );
    const detectedProtocolVersionUpdateBy = new CreateState<string>().run("v2");
    const detectedProtocolVersion = new State(
      detectedProtocolVersionUpdateBy.state,
      detectedProtocolVersionUpdateBy.originatedAt,
      new Date(),
      detectedProtocolVersionToBeUpdated.createdAt,
    );

    const detectedProtocolToBeUpdated = new CreateState<string>().run(
      "oldProto",
    );
    const detectedProtocolUpdateBy = new CreateState<string>().run("newProto");
    const detectedProtocol = new State(
      detectedProtocolUpdateBy.state,
      detectedProtocolUpdateBy.originatedAt,
      new Date(),
      detectedProtocolToBeUpdated.createdAt,
    );

    const connectionStateToBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
      ),
    );
    const connectionStateUpdateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
      ),
    );

    const connectionState = connectionStateUpdateBy;
    connectionState.state.updatedAt = new Date();

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

    if (
      toBeUpdated.detectedProtocolVersion === undefined ||
      updateBy.detectedProtocolVersion === undefined ||
      toBeUpdated.detectedProtocol === undefined ||
      updateBy.detectedProtocol === undefined
    ) {
      assert.fail(
        "detectedProtocolVersion or detectedProtocol should not be undefined",
      );
    }

    when(
      updateConnectionState.run(toBeUpdated.state, updateBy.state),
    ).thenReturn(new UpdateConnectionStateResult(updateBy.state, {}));

    when(
      updateState.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocolVersion, {}));
    when(
      updateState.run(toBeUpdated.detectedProtocol, updateBy.detectedProtocol),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocol, {}));

    when(
      updateDetectedProtocol.run(
        toBeUpdated.detectedProtocol,
        updateBy.detectedProtocol,
      ),
    ).thenReturn(new UpdateStateResult(detectedProtocol, {}));

    when(
      updateDetectedProtocolVersion.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(detectedProtocolVersion, {}));

    when(
      updateSetProtocolVersion.run(
        toBeUpdated.setProtocolVersion,
        updateBy.setProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    when(
      updateSetProtocol.run(toBeUpdated.setProtocol, updateBy.setProtocol),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    const updateConnectionModuleResult = updateConnectionModule.run(
      toBeUpdated,
      updateBy,
    );

    assert.strictEqual(
      updateConnectionModuleResult.new.state?.state.state,
      updateBy.state?.state.state,
    );
    assert.strictEqual(
      updateConnectionModuleResult.new.state?.state.originatedAt,
      updateBy.state?.state.originatedAt,
    );
    assert.deepStrictEqual(
      updateConnectionModuleResult.new.state?.state.createdAt,
      toBeUpdated.state?.state.createdAt,
    );
    assert.ok(
      updateConnectionModuleResult.new.state?.state.updatedAt instanceof Date,
    );
  });

  it("should update connectionState and return changes", () => {
    const detectedProtocolVersionToBeUpdated = new CreateState<string>().run(
      "v1",
    );
    const detectedProtocolVersionUpdateBy = new CreateState<string>().run("v2");
    const detectedProtocolVersion = new State(
      detectedProtocolVersionUpdateBy.state,
      detectedProtocolVersionUpdateBy.originatedAt,
      new Date(),
      detectedProtocolVersionToBeUpdated.createdAt,
    );

    const detectedProtocolToBeUpdated = new CreateState<string>().run(
      "oldProto",
    );
    const detectedProtocolUpdateBy = new CreateState<string>().run("newProto");
    const detectedProtocol = new State(
      detectedProtocolUpdateBy.state,
      detectedProtocolUpdateBy.originatedAt,
      new Date(),
      detectedProtocolToBeUpdated.createdAt,
    );

    const connectionStateToBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
      ),
    );
    const connectionStateUpdateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
      ),
    );

    const connectionState = connectionStateUpdateBy;
    connectionState.state.updatedAt = new Date();

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

    if (
      toBeUpdated.detectedProtocolVersion === undefined ||
      updateBy.detectedProtocolVersion === undefined ||
      toBeUpdated.detectedProtocol === undefined ||
      updateBy.detectedProtocol === undefined
    ) {
      assert.fail(
        "detectedProtocolVersion or detectedProtocol should not be undefined",
      );
    }

    when(
      updateConnectionState.run(toBeUpdated.state, updateBy.state),
    ).thenReturn(
      new UpdateConnectionStateResult(
        connectionState,
        new PartialConnectionStateDto(
          new StateDtoChanges(updateBy.state?.state.state),
        ),
      ),
    );

    when(
      updateState.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocolVersion, {}));
    when(
      updateState.run(toBeUpdated.detectedProtocol, updateBy.detectedProtocol),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocol, {}));

    when(
      updateDetectedProtocol.run(
        toBeUpdated.detectedProtocol,
        updateBy.detectedProtocol,
      ),
    ).thenReturn(new UpdateStateResult(detectedProtocol, {}));

    when(
      updateDetectedProtocolVersion.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(detectedProtocolVersion, {}));

    when(
      updateSetProtocolVersion.run(
        toBeUpdated.setProtocolVersion,
        updateBy.setProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    when(
      updateSetProtocol.run(toBeUpdated.setProtocol, updateBy.setProtocol),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    const updateConnectionModuleResult = updateConnectionModule.run(
      toBeUpdated,
      updateBy,
    );

    assert.ok(
      updateConnectionModuleResult.changes instanceof
        PartialConnectionModuleDto,
    );
    assert.strictEqual(
      updateConnectionModuleResult.changes?.state?.state?.state,
      updateBy.state?.state.state,
    );
  });

  it("should update detectedProtocol", () => {
    const detectedProtocolVersionToBeUpdated = new CreateState<string>().run(
      "v1",
    );
    const detectedProtocolVersionUpdateBy = new CreateState<string>().run("v2");
    const detectedProtocolVersion = new State(
      detectedProtocolVersionUpdateBy.state,
      detectedProtocolVersionUpdateBy.originatedAt,
      new Date(),
      detectedProtocolVersionToBeUpdated.createdAt,
    );

    const detectedProtocolToBeUpdated = new CreateState<string>().run(
      "oldProto",
    );
    const detectedProtocolUpdateBy = new CreateState<string>().run("newProto");
    const detectedProtocol = new State(
      detectedProtocolUpdateBy.state,
      detectedProtocolUpdateBy.originatedAt,
      new Date(),
      detectedProtocolToBeUpdated.createdAt,
    );

    const connectionStateToBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
      ),
    );
    const connectionStateUpdateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
      ),
    );

    const connectionState = connectionStateUpdateBy;
    connectionState.state.updatedAt = new Date();

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

    if (
      toBeUpdated.detectedProtocolVersion === undefined ||
      updateBy.detectedProtocolVersion === undefined ||
      toBeUpdated.detectedProtocol === undefined ||
      updateBy.detectedProtocol === undefined
    ) {
      assert.fail(
        "detectedProtocolVersion or detectedProtocol should not be undefined",
      );
    }

    when(
      updateConnectionState.run(toBeUpdated.state, updateBy.state),
    ).thenReturn(new UpdateConnectionStateResult(connectionState, {}));

    when(
      updateState.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocolVersion, {}));
    when(
      updateState.run(toBeUpdated.detectedProtocol, updateBy.detectedProtocol),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocol, {}));

    when(
      updateDetectedProtocol.run(
        toBeUpdated.detectedProtocol,
        updateBy.detectedProtocol,
      ),
    ).thenReturn(new UpdateStateResult(detectedProtocol, {}));

    when(
      updateDetectedProtocolVersion.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(detectedProtocolVersion, {}));

    when(
      updateSetProtocolVersion.run(
        toBeUpdated.setProtocolVersion,
        updateBy.setProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    when(
      updateSetProtocol.run(toBeUpdated.setProtocol, updateBy.setProtocol),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    const updateConnectionModuleResult = updateConnectionModule.run(
      toBeUpdated,
      updateBy,
    );

    assert.deepStrictEqual(
      updateConnectionModuleResult.new.detectedProtocol?.state,
      updateBy.detectedProtocol?.state,
    );
    assert.strictEqual(
      updateConnectionModuleResult.new.detectedProtocol?.originatedAt,
      updateBy.detectedProtocol?.originatedAt,
    );
    assert.strictEqual(
      updateConnectionModuleResult.new.detectedProtocol?.createdAt,
      toBeUpdated.detectedProtocol?.createdAt,
    );
    assert.ok(
      updateConnectionModuleResult.new.detectedProtocol?.updatedAt instanceof
        Date,
    );
  });

  it("should update detectedProtocol and return changes", () => {
    const detectedProtocolVersionToBeUpdated = new CreateState<string>().run(
      "v1",
    );
    const detectedProtocolVersionUpdateBy = new CreateState<string>().run("v2");
    const detectedProtocolVersion = new State(
      detectedProtocolVersionUpdateBy.state,
      detectedProtocolVersionUpdateBy.originatedAt,
      new Date(),
      detectedProtocolVersionToBeUpdated.createdAt,
    );

    const detectedProtocolToBeUpdated = new CreateState<string>().run(
      "oldProto",
    );
    const detectedProtocolUpdateBy = new CreateState<string>().run("newProto");
    const detectedProtocol = new State(
      detectedProtocolUpdateBy.state,
      detectedProtocolUpdateBy.originatedAt,
      new Date(),
      detectedProtocolToBeUpdated.createdAt,
    );

    const connectionStateToBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
      ),
    );
    const connectionStateUpdateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
      ),
    );

    const connectionState = connectionStateUpdateBy;
    connectionState.state.updatedAt = new Date();

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

    if (
      toBeUpdated.detectedProtocolVersion === undefined ||
      updateBy.detectedProtocolVersion === undefined ||
      toBeUpdated.detectedProtocol === undefined ||
      updateBy.detectedProtocol === undefined
    ) {
      assert.fail(
        "detectedProtocolVersion or detectedProtocol should not be undefined",
      );
    }

    when(
      updateConnectionState.run(toBeUpdated.state, updateBy.state),
    ).thenReturn(new UpdateConnectionStateResult(connectionState, undefined));

    when(
      updateState.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocolVersion, {}));

    when(
      updateState.run(toBeUpdated.detectedProtocol, updateBy.detectedProtocol),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocol, undefined));

    when(
      updateDetectedProtocol.run(
        toBeUpdated.detectedProtocol,
        updateBy.detectedProtocol,
      ),
    ).thenReturn(
      new UpdateStateResult(
        detectedProtocol,
        new StateDtoChanges<string>(updateBy.detectedProtocol?.state),
      ),
    );

    when(
      updateDetectedProtocolVersion.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(detectedProtocolVersion, {}));

    when(
      updateSetProtocolVersion.run(
        toBeUpdated.setProtocolVersion,
        updateBy.setProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    when(
      updateSetProtocol.run(toBeUpdated.setProtocol, updateBy.setProtocol),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    const updateConnectionModuleResult = updateConnectionModule.run(
      toBeUpdated,
      updateBy,
    );

    assert.ok(
      updateConnectionModuleResult.changes instanceof
        PartialConnectionModuleDto,
    );
    assert.strictEqual(
      updateConnectionModuleResult.changes?.detectedProtocol?.state,
      updateBy.detectedProtocol?.state,
    );
  });

  it("should update detectedProtocolVersion", () => {
    const detectedProtocolVersionToBeUpdated = new CreateState<string>().run(
      "v1",
    );
    const detectedProtocolVersionUpdateBy = new CreateState<string>().run("v2");
    const detectedProtocolVersion = new State(
      detectedProtocolVersionUpdateBy.state,
      detectedProtocolVersionUpdateBy.originatedAt,
      new Date(),
      detectedProtocolVersionToBeUpdated.createdAt,
    );

    const detectedProtocolToBeUpdated = new CreateState<string>().run(
      "oldProto",
    );
    const detectedProtocolUpdateBy = new CreateState<string>().run("newProto");
    const detectedProtocol = new State(
      detectedProtocolUpdateBy.state,
      detectedProtocolUpdateBy.originatedAt,
      new Date(),
      detectedProtocolToBeUpdated.createdAt,
    );

    const connectionStateToBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
      ),
    );
    const connectionStateUpdateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
      ),
    );

    const connectionState = connectionStateUpdateBy;
    connectionState.state.updatedAt = new Date();

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

    if (
      toBeUpdated.detectedProtocolVersion === undefined ||
      updateBy.detectedProtocolVersion === undefined ||
      toBeUpdated.detectedProtocol === undefined ||
      updateBy.detectedProtocol === undefined
    ) {
      assert.fail(
        "detectedProtocolVersion or detectedProtocol should not be undefined",
      );
    }

    when(
      updateConnectionState.run(toBeUpdated.state, updateBy.state),
    ).thenReturn(new UpdateConnectionStateResult(connectionState, {}));

    when(
      updateState.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocolVersion, {}));
    when(
      updateState.run(toBeUpdated.detectedProtocol, updateBy.detectedProtocol),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocol, {}));

    when(
      updateDetectedProtocol.run(
        toBeUpdated.detectedProtocol,
        updateBy.detectedProtocol,
      ),
    ).thenReturn(new UpdateStateResult(detectedProtocol, {}));

    when(
      updateDetectedProtocolVersion.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(detectedProtocolVersion, {}));

    when(
      updateSetProtocolVersion.run(
        toBeUpdated.setProtocolVersion,
        updateBy.setProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    when(
      updateSetProtocol.run(toBeUpdated.setProtocol, updateBy.setProtocol),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    const updateConnectionModuleResult = updateConnectionModule.run(
      toBeUpdated,
      updateBy,
    );

    assert.deepStrictEqual(
      updateConnectionModuleResult.new.detectedProtocolVersion?.state,
      updateBy.detectedProtocolVersion?.state,
    );
    assert.strictEqual(
      updateConnectionModuleResult.new.detectedProtocolVersion?.originatedAt,
      updateBy.detectedProtocolVersion?.originatedAt,
    );
    assert.strictEqual(
      updateConnectionModuleResult.new.detectedProtocolVersion?.createdAt,
      toBeUpdated.detectedProtocolVersion?.createdAt,
    );
    assert.ok(
      updateConnectionModuleResult.new.detectedProtocolVersion
        ?.updatedAt instanceof Date,
    );
  });

  it("should update detectedProtocolVersion and return changes", () => {
    const detectedProtocolVersionToBeUpdated = new CreateState<string>().run(
      "v1",
    );
    const detectedProtocolVersionUpdateBy = new CreateState<string>().run("v2");
    const detectedProtocolVersion = new State(
      detectedProtocolVersionUpdateBy.state,
      detectedProtocolVersionUpdateBy.originatedAt,
      new Date(),
      detectedProtocolVersionToBeUpdated.createdAt,
    );

    const detectedProtocolToBeUpdated = new CreateState<string>().run(
      "oldProto",
    );
    const detectedProtocolUpdateBy = new CreateState<string>().run("newProto");
    const detectedProtocol = new State(
      detectedProtocolUpdateBy.state,
      detectedProtocolUpdateBy.originatedAt,
      new Date(),
      detectedProtocolToBeUpdated.createdAt,
    );

    const connectionStateToBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
      ),
    );
    const connectionStateUpdateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
      ),
    );

    const connectionState = connectionStateUpdateBy;
    connectionState.state.updatedAt = new Date();

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

    if (
      toBeUpdated.detectedProtocolVersion === undefined ||
      updateBy.detectedProtocolVersion === undefined ||
      toBeUpdated.detectedProtocol === undefined ||
      updateBy.detectedProtocol === undefined
    ) {
      assert.fail(
        "detectedProtocolVersion or detectedProtocol should not be undefined",
      );
    }

    when(
      updateConnectionState.run(toBeUpdated.state, updateBy.state),
    ).thenReturn(new UpdateConnectionStateResult(connectionState, undefined));

    when(
      updateState.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocolVersion, {}));

    when(
      updateState.run(toBeUpdated.detectedProtocol, updateBy.detectedProtocol),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocol, undefined));

    when(
      updateDetectedProtocol.run(
        toBeUpdated.detectedProtocol,
        updateBy.detectedProtocol,
      ),
    ).thenReturn(new UpdateStateResult(detectedProtocol, undefined));

    when(
      updateDetectedProtocolVersion.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(
      new UpdateStateResult(
        detectedProtocolVersion,
        new StateDtoChanges<string>(updateBy.detectedProtocolVersion?.state),
      ),
    );

    when(
      updateSetProtocolVersion.run(
        toBeUpdated.setProtocolVersion,
        updateBy.setProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    when(
      updateSetProtocol.run(toBeUpdated.setProtocol, updateBy.setProtocol),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    const updateConnectionModuleResult = updateConnectionModule.run(
      toBeUpdated,
      updateBy,
    );

    assert.ok(
      updateConnectionModuleResult.changes instanceof
        PartialConnectionModuleDto,
    );
    assert.strictEqual(
      updateConnectionModuleResult.changes?.detectedProtocolVersion?.state,
      updateBy.detectedProtocolVersion?.state,
    );
  });

  it("should update setProtocol", () => {
    const setProtocolVersionToBeUpdated = undefined;
    const setProtocolVersionUpdateBy = new CreateState<string>().run("v2");

    const setProtocolToBeUpdated = undefined;
    const setProtocolUpdateBy = new CreateState<string>().run("newProto");

    const detectedProtocolVersionToBeUpdated = new CreateState<string>().run(
      "v1",
    );
    const detectedProtocolVersionUpdateBy = new CreateState<string>().run("v2");
    const detectedProtocolVersion = new State(
      detectedProtocolVersionUpdateBy.state,
      detectedProtocolVersionUpdateBy.originatedAt,
      new Date(),
      detectedProtocolVersionToBeUpdated.createdAt,
    );

    const detectedProtocolToBeUpdated = new CreateState<string>().run(
      "oldProto",
    );
    const detectedProtocolUpdateBy = new CreateState<string>().run("newProto");
    const detectedProtocol = new State(
      detectedProtocolUpdateBy.state,
      detectedProtocolUpdateBy.originatedAt,
      new Date(),
      detectedProtocolToBeUpdated.createdAt,
    );

    const connectionStateToBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
      ),
    );
    const connectionStateUpdateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
      ),
    );

    const connectionState = connectionStateUpdateBy;
    connectionState.state.updatedAt = new Date();

    const toBeUpdated = new ConnectionModule(
      imei,
      connectionStateToBeUpdated,
      detectedProtocolVersionToBeUpdated,
      setProtocolVersionToBeUpdated,
      detectedProtocolToBeUpdated,
      setProtocolToBeUpdated,
    );
    const updateBy = new ConnectionModule(
      imei,
      connectionStateUpdateBy,
      detectedProtocolVersionUpdateBy,
      setProtocolVersionUpdateBy,
      detectedProtocolUpdateBy,
      setProtocolUpdateBy,
    );

    if (
      toBeUpdated.detectedProtocolVersion === undefined ||
      updateBy.detectedProtocolVersion === undefined ||
      toBeUpdated.detectedProtocol === undefined ||
      updateBy.detectedProtocol === undefined
    ) {
      assert.fail(
        "detectedProtocolVersion or detectedProtocol should not be undefined",
      );
    }

    when(
      updateConnectionState.run(toBeUpdated.state, updateBy.state),
    ).thenReturn(new UpdateConnectionStateResult(connectionState, undefined));

    when(
      updateState.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocolVersion, {}));

    when(
      updateState.run(toBeUpdated.detectedProtocol, updateBy.detectedProtocol),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocol, undefined));

    when(
      updateDetectedProtocol.run(
        toBeUpdated.detectedProtocol,
        updateBy.detectedProtocol,
      ),
    ).thenReturn(new UpdateStateResult(detectedProtocol, undefined));

    when(
      updateDetectedProtocolVersion.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(
      new UpdateStateResult(
        detectedProtocolVersion,
        new StateDtoChanges<string>(updateBy.detectedProtocolVersion?.state),
      ),
    );

    when(
      updateSetProtocolVersion.run(
        toBeUpdated.setProtocolVersion,
        updateBy.setProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    when(
      updateSetProtocol.run(toBeUpdated.setProtocol, updateBy.setProtocol),
    ).thenReturn(new UpdateStateResult(setProtocolUpdateBy, {}));

    const updateConnectionModuleResult = updateConnectionModule.run(
      toBeUpdated,
      updateBy,
    );

    assert.deepStrictEqual(
      updateConnectionModuleResult.new.setProtocol,
      setProtocolUpdateBy,
    );
  });

  it("should update setProtocolVersion", () => {
    const setProtocolVersionToBeUpdated = undefined;
    const setProtocolVersionUpdateBy = new CreateState<string>().run("v2");

    const setProtocolToBeUpdated = undefined;
    const setProtocolUpdateBy = new CreateState<string>().run("newProto");

    const detectedProtocolVersionToBeUpdated = new CreateState<string>().run(
      "v1",
    );
    const detectedProtocolVersionUpdateBy = new CreateState<string>().run("v2");
    const detectedProtocolVersion = new State(
      detectedProtocolVersionUpdateBy.state,
      detectedProtocolVersionUpdateBy.originatedAt,
      new Date(),
      detectedProtocolVersionToBeUpdated.createdAt,
    );

    const detectedProtocolToBeUpdated = new CreateState<string>().run(
      "oldProto",
    );
    const detectedProtocolUpdateBy = new CreateState<string>().run("newProto");
    const detectedProtocol = new State(
      detectedProtocolUpdateBy.state,
      detectedProtocolUpdateBy.originatedAt,
      new Date(),
      detectedProtocolToBeUpdated.createdAt,
    );

    const connectionStateToBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
      ),
    );
    const connectionStateUpdateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
      ),
    );

    const connectionState = connectionStateUpdateBy;
    connectionState.state.updatedAt = new Date();

    const toBeUpdated = new ConnectionModule(
      imei,
      connectionStateToBeUpdated,
      detectedProtocolVersionToBeUpdated,
      setProtocolVersionToBeUpdated,
      detectedProtocolToBeUpdated,
      setProtocolToBeUpdated,
    );
    const updateBy = new ConnectionModule(
      imei,
      connectionStateUpdateBy,
      detectedProtocolVersionUpdateBy,
      setProtocolVersionUpdateBy,
      detectedProtocolUpdateBy,
      setProtocolUpdateBy,
    );

    if (
      toBeUpdated.detectedProtocolVersion === undefined ||
      updateBy.detectedProtocolVersion === undefined ||
      toBeUpdated.detectedProtocol === undefined ||
      updateBy.detectedProtocol === undefined
    ) {
      assert.fail(
        "detectedProtocolVersion or detectedProtocol should not be undefined",
      );
    }

    when(
      updateConnectionState.run(toBeUpdated.state, updateBy.state),
    ).thenReturn(new UpdateConnectionStateResult(connectionState, undefined));

    when(
      updateState.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocolVersion, {}));

    when(
      updateState.run(toBeUpdated.detectedProtocol, updateBy.detectedProtocol),
    ).thenReturn(new UpdateStateResultNoUndefined(detectedProtocol, undefined));

    when(
      updateDetectedProtocol.run(
        toBeUpdated.detectedProtocol,
        updateBy.detectedProtocol,
      ),
    ).thenReturn(new UpdateStateResult(detectedProtocol, undefined));

    when(
      updateDetectedProtocolVersion.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(
      new UpdateStateResult(
        detectedProtocolVersion,
        new StateDtoChanges<string>(updateBy.detectedProtocolVersion?.state),
      ),
    );

    when(
      updateSetProtocolVersion.run(
        toBeUpdated.setProtocolVersion,
        updateBy.setProtocolVersion,
      ),
    ).thenReturn(new UpdateStateResult(setProtocolVersionUpdateBy, {}));

    when(
      updateSetProtocol.run(toBeUpdated.setProtocol, updateBy.setProtocol),
    ).thenReturn(new UpdateStateResult(undefined, {}));

    const updateConnectionModuleResult = updateConnectionModule.run(
      toBeUpdated,
      updateBy,
    );

    assert.deepStrictEqual(
      updateConnectionModuleResult.new.setProtocolVersion,
      setProtocolVersionUpdateBy,
    );
  });
});
