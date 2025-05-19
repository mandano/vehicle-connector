import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { UpdateIoT } from "../../../../../src/vehicle/model/builders/update/components/UpdateIoT.ts";
import { IoT } from "../../../../../src/vehicle/components/iot/IoT.ts";
import { CreatePosition } from "../../../iot/network/CreatePosition.ts";
import { CreateNetwork } from "../../../iot/network/CreateNetwork.ts";

import { FakeUpdatePosition } from "./FakeUpdatePosition.ts";
import { FakeUpdateNetwork } from "./FakeUpdateNetwork.ts";

describe("UpdateIoT", () => {
  let updateIoT: UpdateIoT;

  it("should update position if updateBy has position and toBeUpdated does not", () => {
    const position = new CreatePosition().run();
    const network = new CreateNetwork().run();

    const toBeUpdated = new IoT(undefined, undefined);
    const updateBy = new IoT(network, position);

    if (updateBy.position === undefined) {
      throw new Error("updateBy.position is undefined");
    }

    if (updateBy.network === undefined) {
      throw new Error("updateBy.network is undefined");
    }

    updateIoT = new UpdateIoT(
      new FakeUpdateNetwork(updateBy.network),
      new FakeUpdatePosition(updateBy.position),
    );

    updateIoT.run(toBeUpdated, updateBy);

    assert.strictEqual(toBeUpdated.position, updateBy.position);
  });

  it("should update network if updateBy has network and toBeUpdated does not", () => {
    const position = new CreatePosition().run();
    const network = new CreateNetwork().run();

    const toBeUpdated = new IoT(undefined, undefined);
    const updateBy = new IoT(network, position);

    if (updateBy.position === undefined) {
      throw new Error("updateBy.position is undefined");
    }

    if (updateBy.network === undefined) {
      throw new Error("updateBy.network is undefined");
    }

    updateIoT = new UpdateIoT(
      new FakeUpdateNetwork(updateBy.network),
      new FakeUpdatePosition(updateBy.position),
    );

    updateIoT.run(toBeUpdated, updateBy);

    assert.strictEqual(toBeUpdated.network, updateBy.network);
  });

  it("should return updated network", () => {
    const toBeUpdatedPosition = new CreatePosition().run();
    const toBeUpdatedNetwork = new CreateNetwork().run();

    const updateByPosition = new CreatePosition().run();
    const updateByNetwork = new CreateNetwork().run();

    const toBeUpdated = new IoT(toBeUpdatedNetwork, toBeUpdatedPosition);
    const updateBy = new IoT(updateByNetwork, updateByPosition);

    if (updateBy.position === undefined) {
      throw new Error("updateBy.position is undefined");
    }

    if (updateBy.network === undefined) {
      throw new Error("updateBy.network is undefined");
    }

    updateIoT = new UpdateIoT(
      new FakeUpdateNetwork(updateBy.network),
      new FakeUpdatePosition(updateBy.position),
    );

    updateIoT.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(toBeUpdated.network, updateByNetwork);
  });

  it("should return updated position", () => {
    const toBeUpdatedPosition = new CreatePosition().run();
    const toBeUpdatedNetwork = new CreateNetwork().run();

    const updateByPosition = new CreatePosition().run();
    const updateByNetwork = new CreateNetwork().run();

    const toBeUpdated = new IoT(toBeUpdatedNetwork, toBeUpdatedPosition);
    const updateBy = new IoT(updateByNetwork, updateByPosition);

    if (updateBy.position === undefined) {
      throw new Error("updateBy.position is undefined");
    }

    if (updateBy.network === undefined) {
      throw new Error("updateBy.network is undefined");
    }

    updateIoT = new UpdateIoT(
      new FakeUpdateNetwork(updateBy.network),
      new FakeUpdatePosition(updateBy.position),
    );

    updateIoT.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(toBeUpdated.position, updateByPosition);
  });
});
