import { describe, it } from "node:test";
import assert from "node:assert/strict";

import IoT from "../../../../src/vehicle/components/iot/IoT.ts";
import CloneIoT from "../../../../src/vehicle/components/iot/CloneIoT.ts";
import ClonePosition from "../../../../src/vehicle/components/iot/position/ClonePosition.ts";
import CloneNetwork from "../../../../src/vehicle/components/iot/network/CloneNetwork.ts";
import CloneConnectionModules from "../../../../src/vehicle/components/iot/network/CloneConnectionModules.ts";
import CloneConnectionModule from "../../../../src/vehicle/components/iot/network/CloneConnectionModule.ts";
import CloneConnectionState from "../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import CloneState from "../../../../src/vehicle/model/CloneState.ts";
import ConnectionStates from "../../../../src/vehicle/components/iot/network/connectionModule/connectionState/ConnectionStates.ts";
import CreateNetwork from "../../iot/network/CreateNetwork.ts";
import CreatePosition from "../../iot/network/CreatePosition.ts";

describe("CloneIoT", () => {
  const cloneIoT = new CloneIoT(
    new ClonePosition(),
    new CloneNetwork(
      new CloneConnectionModules(
        new CloneConnectionModule(
          new CloneConnectionState(new CloneState<ConnectionStates>()),
          new CloneState<string>(),
        ),
      ),
    ),
  );

  it("clones IoT with both network and position (deep equal, new references)", () => {
    const network = new CreateNetwork().run();
    const position = new CreatePosition().run();

    const source = new IoT(network, position);

    const cloned = cloneIoT.run(source);

    // Different IoT instance
    assert.notStrictEqual(cloned, source);

    // Network and Position should be present
    assert.ok(cloned.network);
    assert.ok(cloned.position);

    // Deep equal values
    assert.deepStrictEqual(cloned.network, network);
    assert.deepStrictEqual(cloned.position, position);

    // But not the same references
    assert.notStrictEqual(cloned.network, network);
    assert.notStrictEqual(cloned.position, position);

    // Position deep members are cloned (new State instances)
    if (cloned.position && position) {
      assert.notStrictEqual(cloned.position.latitude, position.latitude);
      assert.notStrictEqual(cloned.position.longitude, position.longitude);
      if (position.accuracy !== undefined) {
        assert.ok(cloned.position.accuracy);
        assert.notStrictEqual(cloned.position.accuracy, position.accuracy);
      }
    }
  });

  it("clones IoT with only network set", () => {
    const network = new CreateNetwork().run();
    const source = new IoT(network, undefined);

    const cloned = cloneIoT.run(source);

    assert.notStrictEqual(cloned, source);
    assert.ok(cloned.network);
    assert.strictEqual(cloned.position, undefined);
    assert.deepStrictEqual(cloned.network, network);
    assert.notStrictEqual(cloned.network, network);
  });

  it("clones IoT with only position set", () => {
    const position = new CreatePosition().run();
    const source = new IoT(undefined, position);

    const cloned = cloneIoT.run(source);

    assert.notStrictEqual(cloned, source);
    assert.ok(cloned.position);
    assert.strictEqual(cloned.network, undefined);
    assert.deepStrictEqual(cloned.position, position);
    assert.notStrictEqual(cloned.position, position);
  });

  it("clones IoT with neither network nor position (returns empty IoT)", () => {
    const source = new IoT(undefined, undefined);

    const cloned = cloneIoT.run(source);

    assert.notStrictEqual(cloned, source);
    assert.strictEqual(cloned.network, undefined);
    assert.strictEqual(cloned.position, undefined);
  });
});
