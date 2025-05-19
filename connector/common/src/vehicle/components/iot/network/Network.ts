import { State } from "../../../State.ts";

import { ConnectionModule } from "./ConnectionModule.ts";
import { Imei } from "./protocol/Imei.ts";
import { NetworkInterface } from "./NetworkInterface.ts";

export class Network implements NetworkInterface {
  private _connectionModules: ConnectionModule[] = [];

  constructor(connectionModules: ConnectionModule[]) {
    this._connectionModules = connectionModules;
  }

  get connectionModules(): ConnectionModule[] {
    return this._connectionModules;
  }

  set connectionModules(connectionModules: ConnectionModule[]) {
    this._connectionModules = connectionModules;
  }

  public isConnected(): boolean {
    return this._connectionModules.some(
      (connectionModule) =>
        connectionModule.state?.state === ConnectionModule.CONNECTED,
    );
  }

  public getConnectedModule(): ConnectionModule | undefined {
    return this._connectionModules.find(
      (connectionModule) =>
        connectionModule.state?.state === ConnectionModule.CONNECTED,
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
        connectionModule.state?.state === ConnectionModule.CONNECTED,
    )?.imei;
  }

  public multipleModulesConnected(): boolean {
    return (
      this._connectionModules.filter(
        (connectionModule) =>
          connectionModule.state?.state === ConnectionModule.CONNECTED,
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
      this._connectionModules[connectionModuleIdx].state = new State(
        ConnectionModule.DISCONNECTED,
        new Date(),
        new Date(),
        new Date(),
      );
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
      this._connectionModules[connectionModuleIdx].state = new State(
        ConnectionModule.CONNECTED,
        new Date(),
        new Date(),
        new Date(),
      );
    } else {
      this._connectionModules[connectionModuleIdx].setToConnected();
    }
  }
}
