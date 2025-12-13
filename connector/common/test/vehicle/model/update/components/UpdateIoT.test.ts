import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { anything, instance, mock, when } from "ts-mockito";

import UpdateIoT from "../../../../../src/vehicle/model/builders/update/components/ioT/UpdateIoT.ts";
import IoT from "../../../../../src/vehicle/components/iot/IoT.ts";
import CreatePosition from "../../../iot/network/CreatePosition.ts";
import CreateNetwork from "../../../iot/network/CreateNetwork.ts";
import UpdateNetwork from "../../../../../src/vehicle/model/builders/update/components/network/UpdateNetwork.ts";
import UpdatePosition from "../../../../../src/vehicle/model/builders/update/components/position/UpdatePosition.ts";
import UpdateNetworkResult from "../../../../../src/vehicle/model/builders/update/components/network/UpdateNetworkResult.ts";
import PartialNetworkDto from "../../../../../src/vehicle/components/iot/network/PartialNetworkDto.ts";
import UpdatePositionResult from "../../../../../src/vehicle/model/builders/update/components/position/UpdatePositionResult.ts";
import PositionChanges from "../../../../../src/vehicle/model/builders/update/components/position/PositionChanges.ts";
import IotChanges from "../../../../../src/vehicle/model/builders/update/components/ioT/IotChanges.ts";
import ClonePosition from "../../../../../src/vehicle/components/iot/position/ClonePosition.ts";
import PositionToChanges from "../../../../../src/vehicle/components/iot/position/PositionToChanges.ts";
import NetworkToChanges from "../../../../../src/vehicle/components/iot/network/NetworkToChanges.ts";
import CloneIoT from "../../../../../src/vehicle/components/iot/CloneIoT.ts";
import IotToChanges from "../../../../../src/vehicle/model/builders/update/components/ioT/IotToChanges.ts";
import CloneNetwork from "../../../../../src/vehicle/components/iot/network/CloneNetwork.ts";
import CloneConnectionModules from "../../../../../src/vehicle/components/iot/network/CloneConnectionModules.ts";
import CloneConnectionModule from "../../../../../src/vehicle/components/iot/network/CloneConnectionModule.ts";
import CloneConnectionState from "../../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import CloneState from "../../../../../src/vehicle/model/CloneState.ts";
import ConnectionStates from "../../../../../src/vehicle/components/iot/network/connectionModule/connectionState/ConnectionStates.ts";
import UpdateStateNoUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import UpdateConnectionModules from "../../../../../src/vehicle/model/builders/update/components/connectionModules/UpdateConnectionModules.ts";
import UpdateConnectionModule from "../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import UpdateConnectionState from "../../../../../src/vehicle/model/builders/update/components/connectionModule/state/UpdateConnectionState.ts";
import UpdateDetectedProtocol from "../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocol.ts";
import UpdateDetectedProtocolVersion from "../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocolVersion.ts";
import UpdateSetProtocolVersion from "../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocolVersion.ts";
import UpdateSetProtocol from "../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocol.ts";
import ConnectionState from "../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import ConnectionModuleToChanges from "../../../../../src/vehicle/model/builders/update/components/connectionModule/ConnectionModuleToChanges.ts";
import StateToChanges from "../../../../../src/vehicle/model/builders/update/components/state/StateToChanges.ts";
import ToBeUpdatedOriginatedAtUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";
import UpdateState from "../../../../../src/vehicle/model/builders/update/components/state/UpdateState.ts";
import CloneStateExt from "../../../../../src/vehicle/model/CloneStateExt.ts";

import { FakeUpdatePosition } from "./FakeUpdatePosition.ts";
import { FakeUpdateNetwork } from "./FakeUpdateNetwork.ts";

describe("UpdateIoT", () => {
  let updateIoT: UpdateIoT;
  const cloneIoT = new CloneIoT(
    new ClonePosition(),
    new CloneNetwork(
      new CloneConnectionModules(
        new CloneConnectionModule(
          new CloneConnectionState(new CloneState<ConnectionStates>()),
          new CloneState(),
        ),
      ),
    ),
  );
  const iotToChanges = new IotToChanges();

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
      cloneIoT,
      iotToChanges,
    );

    const result = updateIoT.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(result.new?.position, updateBy.position);
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

    const updateStateNoUndefined = new UpdateStateNoUndefined(
      new ToBeUpdatedOriginatedAtUndefined(),
      new OriginatedAtUndefined(),
      new UpdateNoUndefined(),
    );

    const updateConnectionModules = new UpdateConnectionModules(
      new UpdateConnectionModule(
        new UpdateConnectionState(
          updateStateNoUndefined,
          new CloneConnectionState(new CloneState<ConnectionStates>()),
        ),
        new UpdateDetectedProtocol(updateStateNoUndefined),
        new UpdateDetectedProtocolVersion(updateStateNoUndefined),
        new UpdateSetProtocolVersion(),
        new UpdateSetProtocol(),
      ),
      new CloneConnectionModule(
        new CloneConnectionState(
          new CloneState<
            | typeof ConnectionState.CONNECTED
            | typeof ConnectionState.DISCONNECTED
          >(),
        ),
        new CloneState<string>(),
      ),
      new ConnectionModuleToChanges(),
    );
    const clonePosition = new ClonePosition();
    const updateState = new UpdateState(
      updateStateNoUndefined,
      new StateToChanges(),
      new CloneStateExt(),
    );
    const updateIoT = new UpdateIoT(
      new UpdateNetwork(updateConnectionModules, new NetworkToChanges(), new CloneNetwork(
        new CloneConnectionModules(
          new CloneConnectionModule(
            new CloneConnectionState(new CloneState<ConnectionStates>()),
            new CloneState<ConnectionStates>(),
          ),
        ),
      ),),
      new UpdatePosition(updateState, clonePosition, new PositionToChanges()),
      cloneIoT,
      new IotToChanges(),
    );

    const result = updateIoT.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(result.new?.network, updateBy.network);
    assert.notStrictEqual(result.new?.network, updateBy.network);
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
      cloneIoT,
      iotToChanges,
    );

    const result = updateIoT.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(result.new?.network, updateByNetwork);
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
      cloneIoT,
      iotToChanges,
    );

    const result = updateIoT.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(result.new?.position, updateByPosition);
  });

  it("should return changes when updated", () => {
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

    const mockedUpdateNetwork = mock(UpdateNetwork);
    when(mockedUpdateNetwork.run(anything(), anything())).thenReturn(
      new UpdateNetworkResult(updateByNetwork, new PartialNetworkDto()),
    );
    const updateNetwork = instance(mockedUpdateNetwork);

    const mockedPosition = mock(UpdatePosition);

    when(mockedPosition.run(anything(), anything())).thenReturn(
      new UpdatePositionResult(updateByPosition, new PositionChanges()),
    );
    const updatePosition = instance(mockedPosition);

    updateIoT = new UpdateIoT(
      updateNetwork,
      updatePosition,
      cloneIoT,
      iotToChanges,
    );

    const result = updateIoT.run(toBeUpdated, updateBy);

    assert.ok(result.changes instanceof IotChanges);
    assert.ok(result.changes.network instanceof PartialNetworkDto);
    assert.ok(result.changes.position instanceof PositionChanges);
  });

  it("replaces undefined IoT", () => {
    const position = new CreatePosition().run();
    const network = new CreateNetwork().run();

    const toBeUpdated = undefined;
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
      cloneIoT,
      iotToChanges,
    );

    const result = updateIoT.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(updateBy, result.new);
  });

  it("does not replace IoT with undefined", () => {
    const position = new CreatePosition().run();
    const network = new CreateNetwork().run();

    const toBeUpdated = new IoT(network, position);
    const updateBy = undefined;

    const updateNetworkMocked = mock(UpdateNetwork);
    const updatePositionMocked = mock(UpdatePosition);

    updateIoT = new UpdateIoT(
      instance(updateNetworkMocked),
      instance(updatePositionMocked),
      cloneIoT,
      iotToChanges,
    );

    const result = updateIoT.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(toBeUpdated, result.new);
  });
});
