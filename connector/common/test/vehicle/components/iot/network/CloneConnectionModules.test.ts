import { describe, it } from "node:test";
import assert from "node:assert/strict";

import CloneConnectionModules from "../../../../../src/vehicle/components/iot/network/CloneConnectionModules.ts";
import CloneConnectionModule from "../../../../../src/vehicle/components/iot/network/CloneConnectionModule.ts";
import CloneConnectionState from "../../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import CloneState from "../../../../../src/vehicle/model/CloneState.ts";
import ConnectionModule from "../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";

import CreateConnectionModule from "./CreateConnectionModule.ts";

describe("CloneConnectionModules", () => {
  const cloneConnectionModules = new CloneConnectionModules(
    new CloneConnectionModule(
      new CloneConnectionState(new CloneState()),
      new CloneState<string>(),
    ),
  );

  it("clones an array of connection modules (deep equal, new references)", () => {
    const modules: ConnectionModule[] = [
      new CreateConnectionModule().run(),
      new CreateConnectionModule().run(),
      new CreateConnectionModule().run(),
    ];

    const cloned = cloneConnectionModules.run(modules);

    // Arrays should be different instances
    assert.notStrictEqual(cloned, modules);

    // Same length and deep equal content
    assert.strictEqual(cloned.length, modules.length);
    assert.deepStrictEqual(cloned, modules);

    // Each element should be a different instance
    for (let i = 0; i < modules.length; i++) {
      assert.notStrictEqual(cloned[i], modules[i]);
    }
  });

  it("returns a new empty array when input is empty", () => {
    const modules: ConnectionModule[] = [];

    const cloned = cloneConnectionModules.run(modules);

    assert.strictEqual(cloned.length, 0);
    // Ensure it's not the same array reference
    assert.notStrictEqual(cloned, modules);
  });
});
