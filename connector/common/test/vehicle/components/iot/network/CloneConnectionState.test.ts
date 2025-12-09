import { describe, it } from "node:test";
import assert from "assert";

import CloneConnectionState from "../../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import ConnectionState from "../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import CreateState from "../../../CreateState.ts";
import CloneState from "../../../../../src/vehicle/model/CloneState.ts";

describe("CloneConnectionState", () => {
  it("clones", () => {
    const state = new CreateState<
      typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
    >().run(ConnectionState.DISCONNECTED, new Date());

    const originalConnectionState = new ConnectionState(state);

    const cloneConnectionState = new CloneConnectionState(
      new CloneState<
        typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
      >(),
    );
    const clonedConnectionState = cloneConnectionState.run(
      originalConnectionState,
    );
    assert.deepStrictEqual(clonedConnectionState, originalConnectionState);
    assert.notStrictEqual(clonedConnectionState, originalConnectionState);
  });
});
