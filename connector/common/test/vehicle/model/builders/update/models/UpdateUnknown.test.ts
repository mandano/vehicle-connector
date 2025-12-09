import assert from "assert";
import { describe, it } from "node:test";

import UpdateUnknown from "../../../../../../src/vehicle/model/builders/update/models/unknown/UpdateUnknown.ts";
import Unknown from "../../../../../../src/vehicle/model/models/Unknown.ts";
import Batteries from "../../../../../../src/vehicle/components/energy/Batteries.ts";
import IoT from "../../../../../../src/vehicle/components/iot/IoT.ts";
import UpdateConnectionModules from "../../../../../../src/vehicle/model/builders/update/components/connectionModules/UpdateConnectionModules.ts";
import UpdateConnectionModule from "../../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import UpdateConnectionState from "../../../../../../src/vehicle/model/builders/update/components/connectionModule/state/UpdateConnectionState.ts";
import CloneConnectionState from "../../../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import CloneState from "../../../../../../src/vehicle/model/CloneState.ts";
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
import UpdateNetwork from "../../../../../../src/vehicle/model/builders/update/components/network/UpdateNetwork.ts";
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
import StateToChanges from "../../../../../../src/vehicle/model/builders/update/components/state/StateToChanges.ts";
import BatteryToChanges from "../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/BatteryToChanges.ts";
import CloneBatteries from "../../../../../../src/vehicle/model/builders/update/components/energy/batteries/CloneBatteries.ts";
import CloneBattery from "../../../../../../src/vehicle/model/builders/update/components/energy/batteries/battery/CloneBattery.ts";
import BatteriesToChanges from "../../../../../../src/vehicle/model/builders/update/components/energy/batteries/BatteriesToChanges.ts";
import UpdateStateNoUndefined from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import ToBeUpdatedOriginatedAtUndefined from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined from "../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";
import UpdateState from "../../../../../../src/vehicle/model/builders/update/components/state/UpdateState.ts";
import CloneStateExt from "../../../../../../src/vehicle/model/CloneStateExt.ts";

describe("UpdateUnknown", () => {
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
  const updateNumberState = new UpdateState(
    new UpdateStateNoUndefined(
      new ToBeUpdatedOriginatedAtUndefined(),
      new OriginatedAtUndefined(),
      new UpdateNoUndefined(),
    ),
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
    new UpdatePosition(
      updateNumberState,
      clonePosition,
      new PositionToChanges(),
    ),
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
  const updater = new UpdateUnknown(updateBatteries, updateIoT);

  it("aggregates results into a new Unknown and UnknownChanges", () => {
    const toBeUpdatedBatteries = new Batteries([]);
    const updateByBatteries = new Batteries([]);
    const toBeUpdatedIot = new IoT();
    const updateByIot = new IoT();

    const toBeUpdated = new Unknown(toBeUpdatedBatteries, toBeUpdatedIot);
    const updateBy = new Unknown(updateByBatteries, updateByIot);

    // Act
    const result = updater.run(toBeUpdated, updateBy);

    assert.ok(result.new instanceof Unknown);
    assert.ok(result.new.batteries instanceof Batteries);
    assert.ok(result.new.ioT instanceof IoT);
  });

  it("handles undefined subcomponents", () => {
    const toBeUpdated = new Unknown(undefined, undefined);
    const updateBy = new Unknown(undefined, undefined);

    const result = updater.run(toBeUpdated, updateBy);

    assert.strictEqual(result.new.batteries, undefined);
    assert.strictEqual(result.new.ioT, undefined);
    assert.strictEqual(result.changes.batteries, undefined);
    assert.strictEqual(result.changes.ioT, undefined);
  });
});
