import { strict as assert } from "assert";
import { beforeEach, describe, it } from "node:test";

import { mock, instance, when } from "ts-mockito";
import { faker } from "@faker-js/faker";
import { THE_SIMPLE_PROTOCOL } from "the-simple-protocol/src/Protocol.ts";

import UpdateConnectionModules from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModules.ts";
import ConnectionModule from "../../../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";
import UpdateConnectionModule from "../../../../../../../src/vehicle/model/builders/update/components/connectionModule/UpdateConnectionModule.ts";
import CloneConnectionModule from "../../../../../../../src/vehicle/components/iot/network/CloneConnectionModule.ts";
import CreateConnectionModule from "../../../../../components/iot/network/CreateConnectionModule.ts";
import ConnectionState from "../../../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import State from "../../../../../../../src/vehicle/State.ts";

describe("UpdateConnectionModules", () => {
  let updateConnectionModules: UpdateConnectionModules;
  let updateConnectionModule: UpdateConnectionModule;
  let cloneConnectionModule: CloneConnectionModule;

  beforeEach(() => {
    updateConnectionModule = mock(UpdateConnectionModule);
    cloneConnectionModule = mock(CloneConnectionModule);
    updateConnectionModules = new UpdateConnectionModules(
      instance(updateConnectionModule),
      instance(cloneConnectionModule),
    );
  });

  it("add new module", () => {
    const moduleTemplate = new CreateConnectionModule().run();

    const toBeUpdated: ConnectionModule[] = [];
    const updateBy: ConnectionModule[] = [moduleTemplate];

    when(cloneConnectionModule.run(updateBy[0])).thenReturn(moduleTemplate);

    const connectionModules = updateConnectionModules.run(
      toBeUpdated,
      updateBy,
    );
    assert.strictEqual(connectionModules.length, 1);
    assert.deepStrictEqual(connectionModules[0], moduleTemplate);
    assert.notStrictEqual(connectionModules[1], moduleTemplate);
  });

  it("update existing module, two modules existing in total", () => {
    const imei = faker.phone.imei();
    const anotherImei = faker.phone.imei();

    const anotherModuleDate = new Date();
    const anotherModule = new CreateConnectionModule().run({
      imei: anotherImei,
      state: new State<
        typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
      >(ConnectionState.DISCONNECTED, anotherModuleDate, undefined, anotherModuleDate),
      detectedProtocolVersion: new State<string>(
        "v0_1",
        anotherModuleDate,
        undefined,
        anotherModuleDate,
      ),
      setProtocolVersion: new State<string>(
        "v0_1",
        anotherModuleDate,
        undefined,
        anotherModuleDate,
      ),
      detectedProtocol: new State<string>(
        THE_SIMPLE_PROTOCOL,
        anotherModuleDate,
        undefined,
        anotherModuleDate,
      ),
      setProtocol: new State<string>(
        THE_SIMPLE_PROTOCOL,
        anotherModuleDate,
        undefined,
        anotherModuleDate,
      ),
    });

    const toBeUpdatedModule = new CreateConnectionModule().run({
      imei: imei,
    });
    const toBeUpdated: ConnectionModule[] = [toBeUpdatedModule, anotherModule];

    const updateByModuleDate = new Date();
    const updateByModule = new CreateConnectionModule().run({
      imei: imei,
      state: new State<
        typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
      >(ConnectionState.DISCONNECTED, updateByModuleDate, undefined, updateByModuleDate),
      detectedProtocolVersion: new State<string>(
        "v0_1",
        updateByModuleDate,
        undefined,
        updateByModuleDate,
      ),
      setProtocolVersion: new State<string>(
        "v0_1",
        updateByModuleDate,
        undefined,
        updateByModuleDate,
      ),
      detectedProtocol: new State<string>(
        THE_SIMPLE_PROTOCOL,
        updateByModuleDate,
        undefined,
        updateByModuleDate,
      ),
      setProtocol: new State<string>(
        THE_SIMPLE_PROTOCOL,
        updateByModuleDate,
        undefined,
        updateByModuleDate,
      ),
    });
    const updateBy: ConnectionModule[] = [updateByModule];

    when(updateConnectionModule.run(toBeUpdated[0], updateBy[0])).thenReturn(
      new CreateConnectionModule().run({
        imei: imei,
        state: new State<
          typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
        >(ConnectionState.DISCONNECTED, updateByModuleDate, undefined, updateByModuleDate),
        detectedProtocolVersion: new State<string>(
          "v0_1",
          updateByModuleDate,
          undefined,
          updateByModuleDate,
        ),
        setProtocolVersion: new State<string>(
          "v0_1",
          updateByModuleDate,
          undefined,
          updateByModuleDate,
        ),
        detectedProtocol: new State<string>(
          THE_SIMPLE_PROTOCOL,
          updateByModuleDate,
          undefined,
          updateByModuleDate,
        ),
        setProtocol: new State<string>(
          THE_SIMPLE_PROTOCOL,
          updateByModuleDate,
          undefined,
          updateByModuleDate,
        ),
      }),
    );
    when(cloneConnectionModule.run(toBeUpdated[1])).thenReturn(
      new CreateConnectionModule().run({
        imei: anotherImei,
        state: new State<
          typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
        >(ConnectionState.DISCONNECTED, anotherModuleDate, undefined, anotherModuleDate),
        detectedProtocolVersion: new State<string>(
          "v0_1",
          anotherModuleDate,
          undefined,
          anotherModuleDate,
        ),
        setProtocolVersion: new State<string>(
          "v0_1",
          anotherModuleDate,
          undefined,
          anotherModuleDate,
        ),
        detectedProtocol: new State<string>(
          THE_SIMPLE_PROTOCOL,
          anotherModuleDate,
          undefined,
          anotherModuleDate,
        ),
        setProtocol: new State<string>(
          THE_SIMPLE_PROTOCOL,
          anotherModuleDate,
          undefined,
          anotherModuleDate,
        ),
      }),
    );

    const connectionModules = updateConnectionModules.run(
      toBeUpdated,
      updateBy,
    );

    assert.strictEqual(connectionModules.length, 2);
    assert.deepStrictEqual(connectionModules[0], updateByModule);
    assert.notStrictEqual(connectionModules[0], updateByModule);
    assert.deepStrictEqual(connectionModules[1], toBeUpdated[1]);
  });
});
