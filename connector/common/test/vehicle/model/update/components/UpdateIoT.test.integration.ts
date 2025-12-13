import { describe, it } from "node:test";
import assert from "node:assert/strict";

import UpdateIoT from "../../../../../src/vehicle/model/builders/update/components/ioT/UpdateIoT.ts";
import IoT from "../../../../../src/vehicle/components/iot/IoT.ts";
import CreatePosition from "../../../iot/network/CreatePosition.ts";
import CreateNetwork from "../../../iot/network/CreateNetwork.ts";
import UpdateNetwork from "../../../../../src/vehicle/model/builders/update/components/network/UpdateNetwork.ts";
import UpdatePosition from "../../../../../src/vehicle/model/builders/update/components/position/UpdatePosition.ts";
import UpdateStateNoUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import UpdateConnectionModules from "../../../../../src/vehicle/model/builders/update/components/connectionModules/UpdateConnectionModules.ts";
import UpdateConnectionModule from "../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import CloneConnectionModule from "../../../../../src/vehicle/components/iot/network/CloneConnectionModule.ts";
import CloneConnectionState from "../../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import CloneState from "../../../../../src/vehicle/model/CloneState.ts";
import ConnectionModuleToChanges from "../../../../../src/vehicle/model/builders/update/components/connectionModule/ConnectionModuleToChanges.ts";
import UpdateConnectionState from "../../../../../src/vehicle/model/builders/update/components/connectionModule/state/UpdateConnectionState.ts";
import ConnectionModule from "../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";
import ClonePosition from "../../../../../src/vehicle/components/iot/position/ClonePosition.ts";
import PositionToChanges from "../../../../../src/vehicle/components/iot/position/PositionToChanges.ts";
import NetworkToChanges from "../../../../../src/vehicle/components/iot/network/NetworkToChanges.ts";
import UpdateDetectedProtocol from "../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocol.ts";
import UpdateDetectedProtocolVersion from "../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocolVersion.ts";
import UpdateSetProtocolVersion from "../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocolVersion.ts";
import UpdateSetProtocol from "../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocol.ts";
import CloneIoT from "../../../../../src/vehicle/components/iot/CloneIoT.ts";
import IotToChanges from "../../../../../src/vehicle/model/builders/update/components/ioT/IotToChanges.ts";
import CloneNetwork from "../../../../../src/vehicle/components/iot/network/CloneNetwork.ts";
import CloneConnectionModules from "../../../../../src/vehicle/components/iot/network/CloneConnectionModules.ts";
import ConnectionStates from "../../../../../src/vehicle/components/iot/network/connectionModule/connectionState/ConnectionStates.ts";
import StateToChanges from "../../../../../src/vehicle/model/builders/update/components/state/StateToChanges.ts";
import ToBeUpdatedOriginatedAtUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined from "../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";
import UpdateState from "../../../../../src/vehicle/model/builders/update/components/state/UpdateState.ts";
import CloneStateExt from "../../../../../src/vehicle/model/CloneStateExt.ts";

describe("UpdateIoT", () => {
  const updateStateNoUndefined = new UpdateStateNoUndefined(
    new ToBeUpdatedOriginatedAtUndefined(),
    new OriginatedAtUndefined(),
    new UpdateNoUndefined(),
  );
  const updateState = new UpdateState(
    updateStateNoUndefined,
    new StateToChanges(),
    new CloneStateExt(),
  );
  const updateIoT = new UpdateIoT(
    new UpdateNetwork(
      new UpdateConnectionModules(
        new UpdateConnectionModule(
          new UpdateConnectionState(
            updateStateNoUndefined,
            new CloneConnectionState(new CloneState()),
          ),
          new UpdateDetectedProtocol(updateStateNoUndefined),
          new UpdateDetectedProtocolVersion(updateStateNoUndefined),
          new UpdateSetProtocolVersion(),
          new UpdateSetProtocol(),
        ),
        new CloneConnectionModule(
          new CloneConnectionState(new CloneState()),
          new CloneState(),
        ),
        new ConnectionModuleToChanges(),
      ),
      new NetworkToChanges(),
      new CloneNetwork(
        new CloneConnectionModules(
          new CloneConnectionModule(
            new CloneConnectionState(new CloneState<ConnectionStates>()),
            new CloneState<ConnectionStates>(),
          ),
        ),
      ),
    ),
    new UpdatePosition(
      updateState,
      new ClonePosition(),
      new PositionToChanges(),
    ),
    new CloneIoT(
      new ClonePosition(),
      new CloneNetwork(
        new CloneConnectionModules(
          new CloneConnectionModule(
            new CloneConnectionState(new CloneState<ConnectionStates>()),
            new CloneState(),
          ),
        ),
      ),
    ),
    new IotToChanges(),
  );

  it("update network", () => {
    const toBeUpdatedOriginatedAt = new Date();

    const updateByOriginatedAt = new Date(new Date().getTime() + 1000);
    const toBeUpdatedPosition = new CreatePosition().run({
      originatedAt: toBeUpdatedOriginatedAt,
    });

    const toBeUpdatedNetwork = new CreateNetwork().run({
      originatedAt: toBeUpdatedOriginatedAt,
    });
    const updateByPosition = new CreatePosition().run({
      originatedAt: updateByOriginatedAt,
    });

    const updateByNetwork = new CreateNetwork().run({
      originatedAt: updateByOriginatedAt,
    });
    const toBeUpdated = new IoT(toBeUpdatedNetwork, toBeUpdatedPosition);

    const updateBy = new IoT(updateByNetwork, updateByPosition);
    if (updateBy.position === undefined) {
      throw new Error("updateBy.position is undefined");
    }
    if (updateBy.network === undefined) {
      throw new Error("updateBy.network is undefined");
    }

    const result = updateIoT.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(
      result.new?.network?.getConnectedModuleByImei(
        updateBy.network.connectionModules[0].imei,
      ),
      new ConnectionModule(
        updateBy.network.connectionModules[0].imei,
        updateBy.network.connectionModules[0].state,
        updateBy.network.connectionModules[0].detectedProtocolVersion,
        updateBy.network.connectionModules[0].setProtocolVersion,
        updateBy.network.connectionModules[0].detectedProtocol,
        updateBy.network.connectionModules[0].setProtocol,
      ),
    );
  });

  it("update position, return changes", () => {
    const toBeUpdatedOriginatedAt = new Date();

    const updateByOriginatedAt = new Date(new Date().getTime() + 1000);
    const toBeUpdatedPosition = new CreatePosition().run({
      originatedAt: toBeUpdatedOriginatedAt,
      accuracy: 2,
    });

    const toBeUpdatedNetwork = new CreateNetwork().run({
      originatedAt: toBeUpdatedOriginatedAt,
    });
    const updateByPosition = new CreatePosition().run({
      originatedAt: updateByOriginatedAt,
      accuracy: 3,
    });

    const updateByNetwork = new CreateNetwork().run({
      originatedAt: updateByOriginatedAt,
    });
    const toBeUpdated = new IoT(toBeUpdatedNetwork, toBeUpdatedPosition);

    const updateBy = new IoT(updateByNetwork, updateByPosition);
    if (updateBy.position === undefined) {
      throw new Error("updateBy.position is undefined");
    }
    if (updateBy.network === undefined) {
      throw new Error("updateBy.network is undefined");
    }

    const result = updateIoT.run(toBeUpdated, updateBy);

    assert.strictEqual(
      result.changes?.position?.latitude?.state,
      updateBy.position.latitude.state,
    );
    assert.strictEqual(
      result.changes?.position?.latitude?.originatedAt,
      updateBy.position.latitude.originatedAt?.toISOString(),
    );
    assert.ok(result.changes?.position?.latitude?.updatedAt);

    assert.strictEqual(
      result.changes?.position?.longitude?.state,
      updateBy.position.longitude.state,
    );
    assert.strictEqual(
      result.changes?.position?.longitude?.originatedAt,
      updateBy.position.longitude.originatedAt?.toISOString(),
    );
    assert.ok(result.changes?.position?.longitude?.updatedAt);

    assert.strictEqual(
      result.changes?.position.accuracy?.state,
      updateBy.position.accuracy?.state,
      "accuracy state change",
    );
    assert.strictEqual(
      result.changes?.position.accuracy?.originatedAt,
      updateBy.position.accuracy?.originatedAt?.toISOString(),
    );
    assert.ok(result.changes?.position.accuracy?.updatedAt);
  });
});
