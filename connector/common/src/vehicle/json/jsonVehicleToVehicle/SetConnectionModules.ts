import { ConnectionModule } from "../../components/iot/network/ConnectionModule.ts";
import { JsonConnectionModule } from "../iot/network/JsonConnectionModule.ts";

import { SetState } from "./SetState.ts";

export class SetConnectionModules {
  private _setState: SetState;

  constructor(setState: SetState) {
    this._setState = setState;
  }

  public run(
    jsonConnectionModules: JsonConnectionModule[],
  ): ConnectionModule[] {
    const connectionModules: ConnectionModule[] = [];

    for (const jsonConnectionModule of jsonConnectionModules) {
      connectionModules.push(this.setConnectionModule(jsonConnectionModule));
    }

    return connectionModules;
  }

  private setConnectionModule(jsonConnectionModule: JsonConnectionModule) {
    let connectionModuleState = undefined;
    let detectedProtocolVersionState = undefined;
    let setProtocolVersion = undefined;
    let detectedProtocol = undefined;
    let setProtocol = undefined;

    if (jsonConnectionModule.state !== undefined) {
      connectionModuleState = this._setState.run<
        typeof ConnectionModule.CONNECTED | typeof ConnectionModule.DISCONNECTED
      >(jsonConnectionModule.state);
    }

    if (jsonConnectionModule.detectedProtocolVersion !== undefined) {
      detectedProtocolVersionState = this._setState.run<string>(
        jsonConnectionModule.detectedProtocolVersion,
      );
    }

    if (jsonConnectionModule.setProtocolVersion !== undefined) {
      setProtocolVersion = this._setState.run<string>(
        jsonConnectionModule.setProtocolVersion,
      );
    }

    if (jsonConnectionModule.detectedProtocol !== undefined) {
      detectedProtocol = this._setState.run<string>(
        jsonConnectionModule.detectedProtocol,
      );
    }

    if (jsonConnectionModule.setProtocol !== undefined) {
      setProtocol = this._setState.run<string>(
        jsonConnectionModule.setProtocol,
      );
    }

    return new ConnectionModule(
      jsonConnectionModule.imei,
      connectionModuleState,
      detectedProtocolVersionState,
      setProtocolVersion,
      detectedProtocol,
      setProtocol
    );
  }
}

export default SetConnectionModules;

