import assert from "assert";
import { beforeEach, describe, it } from "node:test";

import { instance, mock, when } from "ts-mockito";

import ConnectionState from "../../../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import UpdateConnectionState from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/state/UpdateConnectionState.ts";
import CloneConnectionState from "../../../../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import CreateState from "../../../../../CreateState.ts";
import UpdateStateNoUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import UpdateStateResultNoUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateResultNoUndefined.ts";

describe("UpdateConnectionState", () => {
  let updateState: UpdateStateNoUndefined;
  let cloneConnectionState: CloneConnectionState;
  let updateConnectionState: UpdateConnectionState;

  beforeEach(() => {
    updateState = mock(UpdateStateNoUndefined);
    cloneConnectionState = mock(CloneConnectionState);
    updateConnectionState = new UpdateConnectionState(
      instance(updateState),
      instance(cloneConnectionState),
    );
  });

  it("returns undefined if both params undefined", () => {
    const updateConnectionStateResult = updateConnectionState.run(
      undefined,
      undefined,
    );

    assert.strictEqual(updateConnectionStateResult.new, undefined);
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

    const updateConnectionStateResult = updateConnectionState.run(undefined, updateBy);
    assert.deepStrictEqual(updateConnectionStateResult.new, updateBy);
    assert.notStrictEqual(updateConnectionStateResult.new, updateBy);
  });

  it("updates state, when both states exist", () => {
    const toBeUpdatedDate = new Date();
    const toBeUpdated = new ConnectionState(
      new CreateState<typeof ConnectionState.CONNECTED>().run(
        ConnectionState.CONNECTED,
        toBeUpdatedDate,
        undefined,
        toBeUpdatedDate,
      ),
    );

    const updateByDate = new Date();
    const updateBy = new ConnectionState(
      new CreateState<typeof ConnectionState.DISCONNECTED>().run(
        ConnectionState.DISCONNECTED,
        updateByDate,
        undefined,
        updateByDate,
      ),
    );

    when(updateState.run(toBeUpdated.state, updateBy.state)).thenReturn(
      new UpdateStateResultNoUndefined(
        new CreateState<typeof ConnectionState.DISCONNECTED>().run(
          ConnectionState.DISCONNECTED,
          updateByDate,
          undefined,
          updateByDate,
        ),
        {},
      ),
    );
    const updateConnectionStateResult = updateConnectionState.run(toBeUpdated, updateBy);
    assert.deepStrictEqual(updateConnectionStateResult.new, updateBy);
    assert.notStrictEqual(updateConnectionStateResult.new, updateBy);
  });
});
