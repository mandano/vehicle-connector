import assert from "assert";
import { beforeEach, describe, it } from "node:test";

import { instance, mock, when } from "ts-mockito";

import ConnectionState from "../../../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import UpdateConnectionState from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionState.ts";
import CloneConnectionState from "../../../../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import UpdateState from "../../../../../../../src/vehicle/model/builders/update/components/UpdateState.ts";
import CreateState from "../../../../../CreateState.js";

describe("UpdateConnectionState", () => {
  let updateState: UpdateState;
  let cloneConnectionState: CloneConnectionState;
  let updateConnectionState: UpdateConnectionState;

  beforeEach(() => {
    updateState = mock(UpdateState);
    cloneConnectionState = mock(CloneConnectionState);
    updateConnectionState = new UpdateConnectionState(
      instance(updateState),
      instance(cloneConnectionState),
    );
  });

  it("returns undefined if both params undefined", () => {
    when(cloneConnectionState.run(undefined)).thenReturn(undefined);

    const result = updateConnectionState.run(undefined, undefined);

    assert.strictEqual(result, undefined);
  });

  it("clones updateBy if toBeUpdated undefined", () => {
    const date = new Date();

    const updateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
        date,
        undefined,
        date,
      ),
    );

    when(cloneConnectionState.run(updateBy)).thenReturn(
      new ConnectionState(
        new CreateState<typeof ConnectionState.CONNECTED>().run(
          ConnectionState.CONNECTED,
          date,
          undefined,
          date,
        ),
      ),
    );

    const result = updateConnectionState.run(undefined, updateBy);
    assert.deepStrictEqual(result, updateBy);
    assert.notStrictEqual(result, updateBy);
  });

  it("updates state, when both states exist", () => {
    const toBeUpdatedDate = new Date();
    const toBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
        toBeUpdatedDate,
        undefined,
        toBeUpdatedDate
      ),
    );

    const updateByDate = new Date();
    const updateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
        updateByDate,
        undefined,
        updateByDate
      ),
    );

    when(updateState.run(toBeUpdated.state, updateBy.state)).thenReturn(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
        updateByDate,
        undefined,
        updateByDate
      ),
    );
    const result = updateConnectionState.run(toBeUpdated, updateBy);
    assert.deepStrictEqual(result, updateBy);
    assert.notStrictEqual(result, updateBy);
  });

  it("clones toBeUpdated, if state after updateState undefined", () => {
    const toBeUpdatedDate = new Date();
    const toBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
        toBeUpdatedDate,
        undefined,
        toBeUpdatedDate
      ),
    );

    const updateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
        new Date(),
      ),
    );

    when(updateState.run(toBeUpdated.state, updateBy.state)).thenReturn(
      undefined,
    );

    when(cloneConnectionState.run(toBeUpdated)).thenReturn(
      new ConnectionState(
        new CreateState<typeof ConnectionState.CONNECTED>().run(
          ConnectionState.CONNECTED,
          toBeUpdatedDate,
          undefined,
          toBeUpdatedDate
        ),
      ),
    );

    const result = updateConnectionState.run(toBeUpdated, updateBy);
    assert.deepStrictEqual(result, toBeUpdated);
    assert.notStrictEqual(result, toBeUpdated);
  });
});
