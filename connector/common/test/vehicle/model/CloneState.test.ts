import { describe, it } from "node:test";
import assert from "assert";

import CloneState from "../../../src/vehicle/model/CloneState.ts";
import CreateState from "../CreateState.ts";
import ConnectionState from "../../../src/vehicle/components/iot/network/ConnectionState.ts";

describe("CloneState", () => {
  it("clones a string state", () => {
    const originalState = new CreateState<string>().run("theSTATE", new Date());

    const cloneState = new CloneState<string>();
    const clonedState = cloneState.run(originalState);
    assert.deepStrictEqual(clonedState, originalState);
    assert.notStrictEqual(clonedState, originalState);
  });

  it("clones a connection state", () => {
    const originalState = new CreateState<
      typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
    >().run(ConnectionState.DISCONNECTED, new Date());

    const cloneState = new CloneState<string>();
    const clonedState = cloneState.run(originalState);
    assert.deepStrictEqual(clonedState, originalState);
    assert.notStrictEqual(clonedState, originalState);
  });

  it("clones undefined state", () => {
    const cloneState = new CloneState<string>();
    const clonedState = cloneState.run(undefined);
    assert.strictEqual(clonedState, undefined);
  });
});
