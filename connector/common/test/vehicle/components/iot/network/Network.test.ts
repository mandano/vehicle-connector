import { describe, it } from "node:test";
import assert from "node:assert/strict";

import Network from "../../../../../src/vehicle/components/iot/network/Network.ts";
import ConnectionState from "../../../../../src/vehicle/components/iot/network/ConnectionState.ts";
import State from "../../../../../src/vehicle/State.ts";

import CreateConnectionModule from "./CreateConnectionModule.ts";

describe("Network", () => {
  it("isConnected() return true if at least one module connected", () => {
    const modules = [
      new CreateConnectionModule().run({
        state: new State(ConnectionState.CONNECTED),
      }),
      new CreateConnectionModule().run({
        state: new State(ConnectionState.DISCONNECTED),
      }),
    ];
    const network = new Network(modules);
    assert.strictEqual(network.isConnected(), true);
  });

  it("isConnected() return false if no module connected", () => {
    const modules = [
      new CreateConnectionModule().run({
        state: new State(ConnectionState.DISCONNECTED),
      }),
      new CreateConnectionModule().run({
        state: new State(ConnectionState.DISCONNECTED),
      }),
    ];
    const network = new Network(modules);
    assert.strictEqual(network.isConnected(), false);
  });

  it("getConnectedModule() returns first connected module", () => {
    const modules = [
      new CreateConnectionModule().run({
        state: new State(ConnectionState.DISCONNECTED),
      }),
      new CreateConnectionModule().run({
        state: new State(ConnectionState.CONNECTED),
      }),
    ];
    const network = new Network(modules);
    assert.strictEqual(network.getConnectedModule(), modules[1]);
  });

  it("getConnectedModule() returns undefined if no module connected", () => {
    const modules = [
      new CreateConnectionModule().run({
        state: new State(ConnectionState.DISCONNECTED),
      }),
    ];
    const network = new Network(modules);
    assert.strictEqual(network.getConnectedModule(), undefined);
  });

  it("getConnectedModuleByImei() returns connected module by imei", () => {
    const imei = "999";
    const modules = [
      new CreateConnectionModule().run({
        state: new State(ConnectionState.DISCONNECTED),
      }),
      new CreateConnectionModule().run({
        state: new State(ConnectionState.CONNECTED),
        imei: imei,
      }),
    ];
    const network = new Network(modules);
    assert.strictEqual(network.getConnectedModuleByImei(imei), modules[1]);
  });

  it("getConnectedModuleByImei() returns undefined if no Imei matching", () => {
    const modules = [
      new CreateConnectionModule().run({
        state: new State(ConnectionState.CONNECTED),
      }),
    ];
    const network = new Network(modules);
    assert.strictEqual(network.getConnectedModuleByImei("notfound"), undefined);
  });

  it("getImeiOfFirstConnectedModule() returns module for first connected module", () => {
    const imei1 = "111";
    const imei2 = "222";
    const modules = [
      new CreateConnectionModule().run({
        state: new State(ConnectionState.DISCONNECTED),
        imei: imei1,
      }),
      new CreateConnectionModule().run({
        state: new State(ConnectionState.CONNECTED),
        imei: imei2,
      }),
      new CreateConnectionModule().run({
        state: new State(ConnectionState.CONNECTED),
      }),
    ];
    const network = new Network(modules);
    assert.strictEqual(network.getImeiOfFirstConnectedModule(), imei2);
  });

  it("getImeiOfFirstConnectedModule() returns undefined if no module connected", () => {
    const modules = [
      new CreateConnectionModule().run({
        state: new State(ConnectionState.DISCONNECTED),
      }),
      new CreateConnectionModule().run({
        state: new State(ConnectionState.DISCONNECTED),
      }),
    ];
    const network = new Network(modules);
    assert.strictEqual(network.getImeiOfFirstConnectedModule(), undefined);
  });

  it("setConnectionModuleToDisconnected() sets state to of module to disconnected", () => {
    const imei = "555";
    const modules = [
      new CreateConnectionModule().run({
        state: new State(ConnectionState.CONNECTED),
        imei: imei
      }),
    ];
    const network = new Network(modules);
    network.setConnectionModuleToDisconnected(imei);

    if (network.connectionModules[0].state === undefined) {
      assert.fail();
    }

    assert.strictEqual(
      network.connectionModules[0].state.state.state,
      ConnectionState.DISCONNECTED,
    );
  });

  it("setConnectionModuleToDisconnected() does not change module datasets if no matching Imei", () => {
    const modules = [
      new CreateConnectionModule().run({
        state: new State(ConnectionState.CONNECTED),
      }),
    ];

    const network = new Network(modules);
    network.setConnectionModuleToDisconnected("notfound");

    if (network.connectionModules[0].state === undefined) {
      assert.fail();
    }

    assert.strictEqual(
      network.connectionModules[0].state.state.state,
      ConnectionState.CONNECTED,
    );
  });

  it("setConnectionModuleToConnected() sets state of module to connected", () => {
    const imei = "888";
    const modules = [
      new CreateConnectionModule().run({
        state: new State(ConnectionState.DISCONNECTED),
        imei: imei,
      }),
    ];
    const network = new Network(modules);
    network.setConnectionModuleToConnected(imei);

    if (network.connectionModules[0].state === undefined) {
      assert.fail();
    }
    assert.strictEqual(
      network.connectionModules[0].state.state.state,
      ConnectionState.CONNECTED,
    );
  });

  it("setConnectionModuleToConnected() does not change module datasets if no matching Imei", () => {
    const modules = [
      new CreateConnectionModule().run({
        state: new State(ConnectionState.DISCONNECTED),
      }),
    ];
    const network = new Network(modules);
    network.setConnectionModuleToConnected("notfound");
    if (network.connectionModules[0].state === undefined) {
      assert.fail();
    }
    assert.strictEqual(
      network.connectionModules[0].state.state.state,
      ConnectionState.DISCONNECTED,
    );
  });
});
