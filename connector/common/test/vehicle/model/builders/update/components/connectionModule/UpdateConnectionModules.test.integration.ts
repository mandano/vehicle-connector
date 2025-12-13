import { strict as assert } from "assert";
import { beforeEach, describe, it } from "node:test";

import { faker } from "@faker-js/faker";
import { THE_SIMPLE_PROTOCOL } from "the-simple-protocol/src/Protocol.ts";

import UpdateConnectionModules from "../../../../../../../src/vehicle/model/builders/update/components/connectionModules/UpdateConnectionModules.ts";
import ConnectionModule from "../../../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";
import UpdateConnectionModule from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import CloneConnectionModule from "../../../../../../../src/vehicle/components/iot/network/CloneConnectionModule.ts";
import CreateConnectionModule from "../../../../../components/iot/network/CreateConnectionModule.ts";
import ConnectionState from "../../../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import State from "../../../../../../../src/vehicle/State.ts";
import UpdateConnectionState from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/state/UpdateConnectionState.ts";
import CloneConnectionState from "../../../../../../../src/vehicle/components/iot/network/CloneConnectionState.ts";
import UpdateStateNoUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/UpdateStateNoUndefined.ts";
import CloneState from "../../../../../../../src/vehicle/model/CloneState.ts";
import ConnectionStates from "../../../../../../../src/vehicle/components/iot/network/connectionModule/connectionState/ConnectionStates.ts";
import ConnectionModuleToChanges from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/ConnectionModuleToChanges.ts";
import PartialConnectionModuleDto
  from "../../../../../../../src/vehicle/components/iot/network/connectionModule/PartialConnectionModuleDto.ts";
import StateDtoChanges from "../../../../../../../src/vehicle/components/state/StateDtoChanges.ts";
import PartialConnectionStateDto
  from "../../../../../../../src/vehicle/components/iot/network/connectionModule/connectionState/PartialConnectionStateDto.ts";
import UpdateDetectedProtocol
  from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocol.ts";
import UpdateDetectedProtocolVersion
  from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateDetectedProtocolVersion.ts";
import UpdateSetProtocolVersion
  from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocol.ts";
import UpdateSetProtocol
  from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/detectedProtocol/UpdateSetProtocol.ts";
import ToBeUpdatedOriginatedAtUndefined
  from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/OriginatedAtUndefined.ts";
import UpdateNoUndefined
  from "../../../../../../../src/vehicle/model/builders/update/components/state/noUndefined/Update.ts";

describe("UpdateConnectionModules", () => {
  let updateState: UpdateStateNoUndefined;
  let cloneConnectionState: CloneConnectionState;
  let updateConnectionModules: UpdateConnectionModules;
  let updateConnectionModule: UpdateConnectionModule;
  let cloneConnectionModule: CloneConnectionModule;
  let createConnectionModule: CreateConnectionModule;

  beforeEach(() => {
    updateState = new UpdateStateNoUndefined(
      new ToBeUpdatedOriginatedAtUndefined(),
      new OriginatedAtUndefined(),
      new UpdateNoUndefined(),
    );
    cloneConnectionState = new CloneConnectionState(
      new CloneState<ConnectionStates>(),
    );

    updateConnectionModule = new UpdateConnectionModule(
      new UpdateConnectionState(updateState, cloneConnectionState),
      new UpdateDetectedProtocol(updateState),
      new UpdateDetectedProtocolVersion(updateState),
      new UpdateSetProtocolVersion(),
      new UpdateSetProtocol(),
    );
    cloneConnectionModule = new CloneConnectionModule(
      cloneConnectionState,
      new CloneState(),
    );
    updateConnectionModules = new UpdateConnectionModules(
      updateConnectionModule,
      cloneConnectionModule,
      new ConnectionModuleToChanges(),
    );
    createConnectionModule = new CreateConnectionModule();
  });

  it("should add a new module when toBeUpdated is empty", () => {
    const toBeUpdated: ConnectionModule[] = [];
    const moduleToAdd = createConnectionModule.run();
    const updateBy: ConnectionModule[] = [moduleToAdd];

    const result = updateConnectionModules.run(toBeUpdated, updateBy);

    assert.strictEqual(result.new.length, 1);
    assert.deepStrictEqual(result.new[0], updateBy[0]);
    assert.notStrictEqual(result.new[0], updateBy[0]);
  });

  it("should add a new module when toBeUpdated is empty and show changes", () => {
    const toBeUpdated: ConnectionModule[] = [];
    const moduleToAdd = createConnectionModule.run();
    const updateBy: ConnectionModule[] = [moduleToAdd];

    const result = updateConnectionModules.run(toBeUpdated, updateBy);

    assert.deepStrictEqual(result.changes, [new PartialConnectionModuleDto(
      moduleToAdd.imei,
      new PartialConnectionStateDto(
        new StateDtoChanges(
          moduleToAdd.state?.state.state,
          moduleToAdd.state?.state.originatedAt?.toISOString(),
          moduleToAdd.state?.state.createdAt?.toISOString(),
          moduleToAdd.state?.state.updatedAt?.toISOString(),
        ),
      ),
      new StateDtoChanges(
        moduleToAdd.detectedProtocolVersion?.state,
        moduleToAdd.detectedProtocolVersion?.originatedAt?.toISOString(),
        moduleToAdd.detectedProtocolVersion?.createdAt?.toISOString(),
        moduleToAdd.detectedProtocolVersion?.updatedAt?.toISOString(),
      ),
      new StateDtoChanges(
        moduleToAdd.setProtocolVersion?.state,
        moduleToAdd.setProtocolVersion?.originatedAt?.toISOString(),
        moduleToAdd.setProtocolVersion?.createdAt?.toISOString(),
        moduleToAdd.setProtocolVersion?.updatedAt?.toISOString(),
      ),
      new StateDtoChanges(
        moduleToAdd.detectedProtocol?.state,
        moduleToAdd.detectedProtocol?.originatedAt?.toISOString(),
        moduleToAdd.detectedProtocol?.createdAt?.toISOString(),
        moduleToAdd.detectedProtocol?.updatedAt?.toISOString(),
      ),
      new StateDtoChanges(
        moduleToAdd.setProtocol?.state,
        moduleToAdd.setProtocol?.originatedAt?.toISOString(),
        moduleToAdd.setProtocol?.createdAt?.toISOString(),
        moduleToAdd.setProtocol?.updatedAt?.toISOString(),
      )
    )]);
  });

  it("should update an existing module when imei matches", () => {
    const imei = faker.phone.imei();
    const date1 = new Date(2023, 1, 1);
    const date2 = new Date(2023, 1, 2);

    const existingModule = createConnectionModule.run({
      imei,
      state: new State<
        typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
      >(ConnectionState.DISCONNECTED, date1, undefined, date1),
    });

    const updateModule = createConnectionModule.run({
      imei,
      state: new State<
        typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
      >(ConnectionState.CONNECTED, date2, undefined, date2),
    });

    const toBeUpdated: ConnectionModule[] = [existingModule];
    const updateBy: ConnectionModule[] = [updateModule];

    const result = updateConnectionModules.run(toBeUpdated, updateBy);

    assert.strictEqual(result.new.length, 1);
    assert.strictEqual(result.new[0].imei, imei);
    assert.strictEqual(
      result.new[0].state?.state.state,
      updateModule.state?.state.state,
    );
    assert.deepStrictEqual(result.new[0].state?.state.originatedAt, date2);
    assert.notStrictEqual(result.new[0], existingModule);
    assert.notStrictEqual(result.new[0], updateModule);

    assert.ok(result.changes[0]);
    assert.strictEqual(result.changes[0].imei, toBeUpdated[0].imei);
    assert.strictEqual(
      result.changes[0].state?.state?.state,
      updateModule.state?.state.state,
    );
    assert.strictEqual(
      result.changes[0].state?.state?.originatedAt,
      date2.toISOString(),
    );
    assert.ok(result.changes[0].state?.state?.updatedAt);
  });

  it("should update multiple modules at once", () => {
    const imei1 = faker.phone.imei();
    const imei2 = faker.phone.imei();
    const imei3 = faker.phone.imei();

    const stateModule3Old = new State<ConnectionStates>(
      ConnectionState.CONNECTED,
      new Date(new Date().getTime() - 60 * 1000),
    );
    const stateModule3New = new State<ConnectionStates>(
      ConnectionState.DISCONNECTED,
      new Date(),
    );

    const stateModule1Old = new State<ConnectionStates>(
      ConnectionState.DISCONNECTED,
      new Date(new Date().getTime() - 60 * 1000),
    );
    const stateModule1New = new State<ConnectionStates>(
      ConnectionState.CONNECTED,
      new Date(),
    );

    const module1 = createConnectionModule.run({
      imei: imei1,
      state: stateModule1Old,
    });
    const module2 = createConnectionModule.run({ imei: imei2 });
    const module3 = createConnectionModule.run({
      imei: imei3,
      state: stateModule3Old,
    });

    const updateModule1 = createConnectionModule.run({
      imei: imei1,
      state: stateModule1New,
    });
    const updateModule3 = createConnectionModule.run({
      imei: imei3,
      state: stateModule3New,
    });

    const toBeUpdated: ConnectionModule[] = [module1, module2, module3];
    const updateBy: ConnectionModule[] = [updateModule1, updateModule3];

    const result = updateConnectionModules.run(toBeUpdated, updateBy);

    assert.strictEqual(result.new.length, 3);

    const resultImeis = result.new.map((module) => module.imei);
    assert.ok(resultImeis.includes(imei1));
    assert.ok(resultImeis.includes(imei2));
    assert.ok(resultImeis.includes(imei3));

    const updatedModule1 = result.new.find((module) => module.imei === imei1);
    const updatedModule3 = result.new.find((module) => module.imei === imei3);

    assert.strictEqual(
      updatedModule3?.state?.state.state,
      stateModule3New.state,
    );
    assert.strictEqual(
      updatedModule3?.state?.state.originatedAt,
      stateModule3New.originatedAt,
    );

    assert.strictEqual(
      updatedModule1?.state?.state.state,
      stateModule1New.state,
    );
    assert.strictEqual(
      updatedModule1?.state?.state.originatedAt,
      stateModule1New.originatedAt,
    );

    assert.notStrictEqual(updatedModule1, module1);
    assert.notStrictEqual(updatedModule3, module3);
  });

  it("should track changes when updating a module", () => {
    // Arrange
    const imei = faker.phone.imei();
    const date1 = new Date(2023, 1, 1);
    const date2 = new Date(2023, 1, 2);

    const existingModule = createConnectionModule.run({
      imei,
      state: new State<
        typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
      >(ConnectionState.DISCONNECTED, date1, undefined, date1),
      detectedProtocolVersion: new State<string>(
        "v0_1",
        date1,
        undefined,
        date1,
      ),
      setProtocolVersion: new State<string>("v0_1", date1, undefined, date1),
      detectedProtocol: new State<string>(
        THE_SIMPLE_PROTOCOL,
        date1,
        undefined,
        date1,
      ),
      setProtocol: new State<string>(
        THE_SIMPLE_PROTOCOL,
        date1,
        undefined,
        date1,
      ),
    });

    const updateModule = createConnectionModule.run({
      imei,
      state: new State<
        typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
      >(ConnectionState.CONNECTED, date2, undefined, date2),
      detectedProtocolVersion: new State<string>(
        "v0_2",
        date2,
        undefined,
        date2,
      ),
      setProtocolVersion: new State<string>("v0_2", date2, undefined, date2),
      detectedProtocol: new State<string>(
        THE_SIMPLE_PROTOCOL,
        date2,
        undefined,
        date2,
      ),
      setProtocol: new State<string>(
        THE_SIMPLE_PROTOCOL,
        date2,
        undefined,
        date2,
      ),
    });

    const toBeUpdated: ConnectionModule[] = [existingModule];
    const updateBy: ConnectionModule[] = [updateModule];

    const result = updateConnectionModules.run(toBeUpdated, updateBy);

    assert.strictEqual(result.changes[0].imei, imei);
    assert.strictEqual(
      result.changes[0].state?.state?.state,
      updateBy[0].state?.state.state,
    );
    assert.strictEqual(
      result.changes[0].state?.state?.originatedAt,
      updateBy[0].state?.state.originatedAt?.toISOString(),
    );

    assert.strictEqual(
      result.changes[0].detectedProtocolVersion?.state,
      updateBy[0].detectedProtocolVersion?.state,
    );
    assert.strictEqual(
      result.changes[0].detectedProtocolVersion?.originatedAt,
      updateBy[0].detectedProtocolVersion?.originatedAt?.toISOString(),
    );

    assert.strictEqual(
      result.changes[0].detectedProtocol?.originatedAt,
      updateBy[0].detectedProtocol?.originatedAt?.toISOString(),
    );
  });

  it("should handle empty updateBy array", () => {
    const module1 = createConnectionModule.run();
    const module2 = createConnectionModule.run();

    const toBeUpdated: ConnectionModule[] = [module1, module2];
    const updateBy: ConnectionModule[] = [];

    const result = updateConnectionModules.run(toBeUpdated, updateBy);

    assert.strictEqual(result.new.length, 2);
    assert.deepStrictEqual(result.changes, []);

    assert.deepStrictEqual(result.new[0], module1);
    assert.deepStrictEqual(result.new[1], module2);

    assert.notStrictEqual(result.new[0], module1);
    assert.notStrictEqual(result.new[1], module2);
  });

  it("should add a new module when it doesn't exist in toBeUpdated", () => {
    const existingModule = createConnectionModule.run();
    const newModule = createConnectionModule.run();

    const toBeUpdated: ConnectionModule[] = [existingModule];
    const updateBy: ConnectionModule[] = [newModule];

    const result = updateConnectionModules.run(toBeUpdated, updateBy);

    assert.strictEqual(result.new.length, 2);

    const resultImeis = result.new.map((module) => module.imei);
    assert.ok(resultImeis.includes(existingModule.imei));
    assert.ok(resultImeis.includes(newModule.imei));

    // Verify the new module was added with CREATED operation type
    const addedModule = result.new.find(
      (module) => module.imei === newModule.imei,
    );
    assert.deepStrictEqual(addedModule, newModule);
    assert.notStrictEqual(addedModule, newModule);
  });
});
