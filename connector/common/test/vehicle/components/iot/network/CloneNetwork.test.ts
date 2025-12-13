import { describe, it } from "node:test";
import assert from "node:assert/strict";

import CloneNetwork from "../../../../../src/vehicle/components/iot/network/CloneNetwork.ts";
import CloneConnectionModules from "../../../../../src/vehicle/components/iot/network/CloneConnectionModules.ts";
import CloneConnectionModule from "../../../../../src/vehicle/components/iot/network/CloneConnectionModule.ts";
import CloneConnectionState from "../../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import CloneState from "../../../../../src/vehicle/model/CloneState.ts";
import Network from "../../../../../src/vehicle/components/iot/network/Network.ts";
import ConnectionModule from "../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";

import CreateConnectionModule from "./CreateConnectionModule.ts";

describe("CloneNetwork", () => {
  const cloneNetwork = new CloneNetwork(
    new CloneConnectionModules(
      new CloneConnectionModule(
        new CloneConnectionState(new CloneState()),
        new CloneState<string>(),
      ),
    ),
  );

  it("clones a network with multiple modules (deep equal, new references)", () => {
    const modules: ConnectionModule[] = [
      new CreateConnectionModule().run(),
      new CreateConnectionModule().run(),
      new CreateConnectionModule().run(),
    ];

    const source = new Network(modules);

    const cloned = cloneNetwork.run(source);

    // Different Network instance
    assert.notStrictEqual(cloned, source);

    // Connection modules array deep equal but different reference
    assert.deepStrictEqual(cloned.connectionModules, source.connectionModules);
    assert.notStrictEqual(cloned.connectionModules, source.connectionModules);

    // Each module should be a new instance
    for (let i = 0; i < modules.length; i++) {
      assert.notStrictEqual(
        cloned.connectionModules[i],
        source.connectionModules[i],
      );
    }
  });

  it("clones an empty network (returns new empty array)", () => {
    const source = new Network([]);

    const cloned = cloneNetwork.run(source);

    assert.notStrictEqual(cloned, source);
    assert.strictEqual(cloned.connectionModules.length, 0);
    assert.notStrictEqual(cloned.connectionModules, source.connectionModules);
  });

  it("modifying cloned network modules does not affect source", () => {
    const modules: ConnectionModule[] = [
      new CreateConnectionModule().run(),
      new CreateConnectionModule().run(),
    ];
    const source = new Network(modules);

    const cloned = cloneNetwork.run(source);

    // Push a new module to the cloned network
    cloned.connectionModules.push(new CreateConnectionModule().run());

    // Source remains unchanged
    assert.strictEqual(source.connectionModules.length, 2);
    assert.strictEqual(cloned.connectionModules.length, 3);
  });
});
