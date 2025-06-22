import State from "../../../State.ts";

import ConnectionModule from "./ConnectionModule.ts";
import type Imei from "./protocol/Imei.ts";
import NetworkInterface from "./NetworkInterface.ts";
import ConnectionState from "./ConnectionState.ts";

export class Network implements NetworkInterface {
  constructor(private _connectionModules: ConnectionModule[] = []) {}

  get connectionModules(): ConnectionModule[] {
    return this._connectionModules;
  }

  set connectionModules(connectionModules: ConnectionModule[]) {
    this._connectionModules = connectionModules;
  }

  public isConnected(): boolean {
    return this._connectionModules.some(
      (connectionModule) =>
        connectionModule.state?.state.state === ConnectionState.CONNECTED,
    );
  }

  public getConnectedModule(): ConnectionModule | undefined {
    return this._connectionModules.find(
      (connectionModule) =>
        connectionModule.state?.state.state === ConnectionState.CONNECTED,
    );
  }

  public getConnectedModules(): ConnectionModule[] | undefined {
    return this._connectionModules.filter(
      (connectionModule) =>
        connectionModule.state?.state.state === ConnectionState.CONNECTED,
    );
  }

  public getConnectedModuleByImei(imei: Imei): ConnectionModule | undefined {
    return this._connectionModules.find(
      (connectionModule) => connectionModule.imei === imei,
    );
  }

  public containsModules(): boolean {
    return this._connectionModules.length > 0;
  }

  public getImeiOfFirstConnectionModule(): Imei | undefined {
    if (this._connectionModules.length === 0) {
      return undefined;
    }

    return this._connectionModules[0].imei;
  }

  public getImeiOfFirstConnectedModule(): Imei | undefined {
    return this._connectionModules.find(
      (connectionModule) =>
        connectionModule.state?.state.state === ConnectionState.CONNECTED,
    )?.imei;
  }

  public multipleModulesConnected(): boolean {
    return (
      this._connectionModules.filter(
        (connectionModule) =>
          connectionModule.state?.state.state === ConnectionState.CONNECTED,
      ).length > 1
    );
  }

  public setConnectionModuleToDisconnected(imei: Imei): void {
    const connectionModuleIdx = this._connectionModules.findIndex(
      (connectionModule) => connectionModule.imei === imei,
    );

    if (connectionModuleIdx === -1) {
      return;
    }

    if (this._connectionModules[connectionModuleIdx].state === undefined) {
      this._connectionModules[connectionModuleIdx].state = new ConnectionState(
        new State(
          ConnectionState.DISCONNECTED,
          new Date(),
          new Date(),
          new Date(),
        ),
      );
      return;
    }

    this._connectionModules[connectionModuleIdx].setToDisconnected();
  }

  public setConnectionModuleToConnected(imei: Imei): void {
    const connectionModuleIdx = this._connectionModules.findIndex(
      (connectionModule) => connectionModule.imei === imei,
    );

    if (connectionModuleIdx === -1) {
      return;
    }

    if (this._connectionModules[connectionModuleIdx].state === undefined) {
      this._connectionModules[connectionModuleIdx].state = new ConnectionState(
        new State(
          ConnectionState.CONNECTED,
          new Date(),
          new Date(),
          new Date(),
        ),
      );
      return;
    }

    this._connectionModules[connectionModuleIdx].setToConnected();
  }
}

export default Network;
