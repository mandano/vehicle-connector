import assert from "assert";
import { beforeEach, describe, it } from "node:test";

import { mock, instance, when } from "ts-mockito";
import { faker } from "@faker-js/faker";

import UpdateConnectionModule from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import UpdateState from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/../UpdateState.ts";
import UpdateConnectionState from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionState.ts";
import ConnectionModule from "../../../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";
import Imei from "../../../../../../../src/vehicle/components/iot/network/protocol/Imei.ts";
import CreateState from "../../../../../CreateState.ts";
import ConnectionState from "../../../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import State from "../../../../../../../src/vehicle/State.ts";

describe("UpdateConnectionModule", () => {
  let updateState: UpdateState;
  let updateConnectionState: UpdateConnectionState;
  let updateConnectionModule: UpdateConnectionModule;
  let imei: Imei;

  beforeEach(() => {
    updateState = mock(UpdateState);
    updateConnectionState = mock(UpdateConnectionState);
    updateConnectionModule = new UpdateConnectionModule(
      instance(updateState),
      instance(updateConnectionState),
    );
    imei = faker.phone.imei();
  });

  it("should update state and detectedProtocolVersion using updateState and updateConnectionState", () => {
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

    when(
      updateConnectionState.run(toBeUpdated.state, updateBy.state),
    ).thenReturn(connectionState);

    when(
      updateState.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(detectedProtocolVersion);
    when(
      updateState.run(toBeUpdated.detectedProtocol, updateBy.detectedProtocol),
    ).thenReturn(detectedProtocol);

    const connectionModule = updateConnectionModule.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(connectionModule.state, connectionState);
    assert.deepStrictEqual(
      connectionModule.detectedProtocolVersion,
      detectedProtocolVersion,
    );
    assert.deepStrictEqual(connectionModule.detectedProtocol, detectedProtocol);
  });

  it("should set setProtocolVersion and setProtocol if undefined", () => {
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

    when(
      updateConnectionState.run(toBeUpdated.state, updateBy.state),
    ).thenReturn(connectionState);

    when(
      updateState.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      ),
    ).thenReturn(detectedProtocolVersion);
    when(
      updateState.run(toBeUpdated.detectedProtocol, updateBy.detectedProtocol),
    ).thenReturn(detectedProtocol);

    const connectionModule = updateConnectionModule.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(
      connectionModule.setProtocolVersion,
      setProtocolVersionUpdateBy,
    );
    assert.deepStrictEqual(connectionModule.setProtocol, setProtocolUpdateBy);
  });
});
