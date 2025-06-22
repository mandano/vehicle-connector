import assert from "assert";
import { describe, it } from "node:test";

import { faker } from "@faker-js/faker";

import ConnectionModule from "../../../../../src/vehicle/components/iot/network/ConnectionModule.ts";
import State from "../../../../../src/vehicle/State.ts";
import type Imei from "../../../../../src/vehicle/components/iot/network/protocol/Imei.ts";
import ConnectionState from "../../../../../src/vehicle/components/iot/network/ConnectionState.ts";

describe("ConnectionModule", () => {
  const imei: Imei = faker.phone.imei();

  it("should initialize with given imei and undefined state", () => {
    const cm = new ConnectionModule(imei, undefined);
    assert.strictEqual(cm.imei, imei);
    assert.strictEqual(cm.state, undefined);
  });

  it("should get state", () => {
    const state = new ConnectionState(new State(ConnectionState.CONNECTED));
    const cm = new ConnectionModule(imei, state);
    assert.strictEqual(cm.state, state);
  });

  it("should set state", () => {
    const state = new ConnectionState(new State(ConnectionState.CONNECTED));
    const cm = new ConnectionModule(imei, state);

    const newState = new ConnectionState(
      new State(ConnectionState.DISCONNECTED),
    );
    cm.state = newState;
    assert.strictEqual(cm.state, newState);
  });

  it("setToConnected should set state to connected and update originatedAt", () => {
    const state = new ConnectionState(new State(ConnectionState.DISCONNECTED));
    const cm = new ConnectionModule(imei, state);
    cm.setToConnected();
    assert.strictEqual(state.state.state, ConnectionState.CONNECTED);
    assert.ok(state.state.originatedAt instanceof Date);
  });

  it("setToDisconnected should set state to disconnected and update originatedAt", () => {
    const state = new ConnectionState(new State(ConnectionState.CONNECTED));
    const cm = new ConnectionModule(imei, state);
    cm.setToDisconnected();
    assert.strictEqual(state.state.state, ConnectionState.DISCONNECTED);
    assert.ok(state.state.originatedAt instanceof Date);
  });

  it("setToConnected/setToDisconnected should do nothing if state is undefined", () => {
    const cm = new ConnectionModule(imei);
    assert.doesNotThrow(() => cm.setToConnected());
    assert.doesNotThrow(() => cm.setToDisconnected());
  });

  it("should get detectedProtocolVersion", () => {
    const detectedProtocolState = new State("1.0");
    const cm = new ConnectionModule(imei, undefined, detectedProtocolState);
    cm.detectedProtocolVersion = detectedProtocolState;
    assert.strictEqual(cm.detectedProtocolVersion, detectedProtocolState);
  });

  it("should set detectedProtocolVersion", () => {
    const detectedProtocolState = new State("1.0");
    const cm = new ConnectionModule(imei);
    cm.detectedProtocolVersion = detectedProtocolState;
    assert.strictEqual(cm.detectedProtocolVersion, detectedProtocolState);
  });

  it("should get setProtocolVersion", () => {
    const protoState = new State("2.0");
    const cm = new ConnectionModule(imei, undefined, undefined, protoState);
    cm.setProtocolVersion = protoState;
    assert.strictEqual(cm.setProtocolVersion, protoState);
  });

  it("should set setProtocolVersion", () => {
    const protoState = new State("2.0");
    const cm = new ConnectionModule(imei);
    cm.setProtocolVersion = protoState;
    assert.strictEqual(cm.setProtocolVersion, protoState);
  });

  it("should get detectedProtocol", () => {
    const protoState = new State("protoA");
    const cm = new ConnectionModule(
      imei,
      undefined,
      undefined,
      undefined,
      protoState,
    );
    cm.detectedProtocol = protoState;
    assert.strictEqual(cm.detectedProtocol, protoState);
  });

  it("should set detectedProtocol", () => {
    const protoState = new State("protoA");
    const cm = new ConnectionModule(imei);
    cm.detectedProtocol = protoState;
    assert.strictEqual(cm.detectedProtocol, protoState);
  });

  it("should get setProtocol", () => {
    const protoState = new State("protoB");
    const cm = new ConnectionModule(
      imei,
      undefined,
      undefined,
      undefined,
      undefined,
      protoState,
    );
    cm.setProtocol = protoState;
    assert.strictEqual(cm.setProtocol, protoState);
  });

  it("should set setProtocol", () => {
    const protoState = new State("protoB");
    const cm = new ConnectionModule(imei);
    cm.setProtocol = protoState;
    assert.strictEqual(cm.setProtocol, protoState);
  });
});
