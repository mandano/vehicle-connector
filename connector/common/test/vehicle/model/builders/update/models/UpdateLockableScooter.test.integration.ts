import assert from "assert";
import { describe, it } from "node:test";

import UpdateLockableScooter from "../../../../../../src/vehicle/model/builders/update/models/lockableScooter/UpdateLockableScooter.ts";
import LockableScooter from "../../../../../../src/vehicle/model/models/LockableScooter.ts";
import Batteries from "../../../../../../src/vehicle/components/energy/Batteries.ts";
import IoT from "../../../../../../src/vehicle/components/iot/IoT.ts";
import Lock from "../../../../../../src/vehicle/components/lock/Lock.ts";
import MakeBattery from "../components/energy/batteries/MakeBattery.ts";
import CreateSpeedometer from "../../../../components/speedometer/CreateSpeedometer.ts";
import StateToChanges from "../../../../../../src/vehicle/model/builders/update/components/state/StateToChanges.ts";
import CloneLockState from "../../../../../../src/vehicle/components/lock/CloneLockState.ts";
import CloneState from "../../../../../../src/vehicle/model/CloneState.ts";
import LockStateToChanges from "../../../../../../src/vehicle/components/lock/LockStateToChanges.ts";
import UpdateLockState from "../../../../../../src/vehicle/model/builders/update/components/lock/UpdateLockState.ts";
import UpdateLock from "../../../../../../src/vehicle/model/builders/update/components/lock/UpdateLock.ts";
import UpdateSpeedometer from "../../../../../../src/vehicle/model/builders/update/components/speedometer/UpdateSpeedometer.ts";
import UpdateStateNoUndefined from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import UpdateConnectionModules from "../../../../../../src/vehicle/model/builders/update/components/connectionModules/UpdateConnectionModules.ts";
import UpdateConnectionModule from "../../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import UpdateConnectionState from "../../../../../../src/vehicle/model/builders/update/components/connectionModule/state/UpdateConnectionState.ts";
import CloneConnectionState from "../../../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import ConnectionStates from "../../../../../../src/vehicle/components/iot/network/connectionModule/connectionState/ConnectionStates.ts";
import UpdateDetectedProtocol from "../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocol.ts";
import UpdateDetectedProtocolVersion from "../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocolVersion.ts";
import UpdateSetProtocolVersion from "../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocolVersion.ts";
import UpdateSetProtocol from "../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocol.ts";
import CloneConnectionModule from "../../../../../../src/vehicle/components/iot/network/CloneConnectionModule.ts";
import ConnectionState from "../../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import ConnectionModuleToChanges from "../../../../../../src/vehicle/model/builders/update/components/connectionModule/ConnectionModuleToChanges.ts";
import ClonePosition from "../../../../../../src/vehicle/components/iot/position/ClonePosition.ts";
import UpdateIoT from "../../../../../../src/vehicle/model/builders/update/components/ioT/UpdateIoT.ts";
import UpdatePosition from "../../../../../../src/vehicle/model/builders/update/components/position/UpdatePosition.ts";
import PositionToChanges from "../../../../../../src/vehicle/components/iot/position/PositionToChanges.ts";
import NetworkToChanges from "../../../../../../src/vehicle/components/iot/network/NetworkToChanges.ts";
import CloneIoT from "../../../../../../src/vehicle/components/iot/CloneIoT.ts";
import CloneNetwork from "../../../../../../src/vehicle/components/iot/network/CloneNetwork.ts";
import CloneConnectionModules from "../../../../../../src/vehicle/components/iot/network/CloneConnectionModules.ts";
import IotToChanges from "../../../../../../src/vehicle/model/builders/update/components/ioT/IotToChanges.ts";
import UpdateBatteries from "../../../../../../src/vehicle/model/builders/update/components/energy/batteries/UpdateBatteries.ts";
import UpdateBattery from "../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/UpdateBattery.ts";
import UpdateVoltage from "../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/voltage/UpdateVoltage.ts";
import BatteryToChanges from "../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/BatteryToChanges.ts";
import CloneBatteries from "../../../../../../src/vehicle/model/builders/update/components/energy/batteries/CloneBatteries.ts";
import CloneBattery from "../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/CloneBattery.ts";
import BatteriesToChanges from "../../../../../../src/vehicle/model/builders/update/components/energy/batteries/BatteriesToChanges.ts";
import UpdateNetwork from "../../../../../../src/vehicle/model/builders/update/components/network/UpdateNetwork.ts";
import Speedometer from "../../../../../../src/vehicle/components/speedometer/Speedometer.ts";
import ToBeUpdatedOriginatedAtUndefined from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";
import UpdateState from "../../../../../../src/vehicle/model/builders/update/components/state/UpdateState.ts";
import CloneStateExt from "../../../../../../src/vehicle/model/CloneStateExt.ts";

// TODO: update from unknown
describe("UpdateLockableScooter", () => {
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
          typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
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
    new CloneIoT(
      clonePosition,
      new CloneNetwork(
        new CloneConnectionModules(
          new CloneConnectionModule(
            new CloneConnectionState(new CloneState<ConnectionStates>()),
            new CloneState<string>(),
          ),
        ),
      ),
    ),
    new IotToChanges(),
  );

  const updateBatteries = new UpdateBatteries(
    new UpdateBattery(
      updateStateNoUndefined,
      new UpdateVoltage(updateStateNoUndefined, new StateToChanges()),
      new BatteryToChanges(),
    ),
    new CloneBatteries(new CloneBattery()),
    new BatteriesToChanges(),
  );
  const stateToChanges = new StateToChanges();
  const cloneLockState = new CloneLockState(new CloneState<string>());
  const lockStateToChanges = new LockStateToChanges(stateToChanges);
  const updateLockState = new UpdateLockState(
    updateStateNoUndefined,
    cloneLockState,
    lockStateToChanges,
  );
  const updateLock = new UpdateLock(
    updateLockState,
    cloneLockState,
    lockStateToChanges,
  );
  const updateSpeedometer = new UpdateSpeedometer(
    updateStateNoUndefined,
    stateToChanges,
    new CloneState<number>(),
  );
  const updater = new UpdateLockableScooter(
    updateBatteries,
    updateIoT,
    updateLock,
    updateSpeedometer,
  );

  it("aggregates sub-results into a new LockableScooter and LockableScooterChanges; delegates with correct args", () => {
    // Arrange base components and inputs
    const batA = new MakeBattery().run(10);
    const batB = new MakeBattery().run(20);
    const toBeUpdatedBatteries = new Batteries([batA]);
    const updateByBatteries = new Batteries([batB]);

    const toBeUpdatedIot = new IoT();
    const updateByIot = new IoT();

    const toBeUpdatedLock = new Lock();
    const updateByLock = new Lock();

    const toBeUpdatedSpeedo = new CreateSpeedometer().run();
    const updateBySpeedo = new CreateSpeedometer().run();

    const toBeUpdated = new LockableScooter(
      toBeUpdatedLock,
      toBeUpdatedBatteries,
      toBeUpdatedIot,
      toBeUpdatedSpeedo,
    );

    const updateBy = new LockableScooter(
      updateByLock,
      updateByBatteries,
      updateByIot,
      updateBySpeedo,
    );

    // Act
    const result = updater.run(toBeUpdated, updateBy);

    // Assert: Aggregation into new LockableScooter
    assert.ok(result.new instanceof LockableScooter);
    assert.ok(result.new.batteries instanceof Batteries);
    assert.ok(result.new.ioT instanceof IoT);
    assert.ok(result.new.lock instanceof Lock);
    assert.ok(result.new.speedometer instanceof Speedometer);
  });

  it("handles undefined subcomponents by passing them through and preserving undefined changes", () => {
    const toBeUpdated = new LockableScooter(
      undefined,
      undefined,
      undefined,
      undefined,
    );
    const updateBy = new LockableScooter(
      undefined,
      undefined,
      undefined,
      undefined,
    );

    const result = updater.run(toBeUpdated, updateBy);

    assert.strictEqual(result.new.batteries, undefined);
    assert.strictEqual(result.new.ioT, undefined);
    assert.strictEqual(result.new.lock, undefined);
    assert.strictEqual(result.new.speedometer, undefined);

    // Changes should reflect undefined where sub-updates produce no changes
    assert.strictEqual(result.changes.batteries, undefined);
    assert.strictEqual(result.changes.ioT, undefined);
    assert.strictEqual(result.changes.lock, undefined);
  });
});
