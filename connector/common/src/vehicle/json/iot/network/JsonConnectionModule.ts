import { Imei } from "../../../components/iot/network/protocol/Imei.ts";
import { ConnectionModule } from "../../../components/iot/network/ConnectionModule.ts";
import { StateJson } from "../../StateJson.ts";
import { State } from "../../../State.ts";

export class JsonConnectionModule {
  public imei: Imei;
  public state:
    | StateJson<
        typeof ConnectionModule.CONNECTED | typeof ConnectionModule.DISCONNECTED
      >
    | undefined;
  public detectedProtocolVersion: StateJson<string> | undefined;
  public setProtocolVersion: StateJson<string> | undefined;
  public detectedProtocol: StateJson<string> | undefined;
  public setProtocol: StateJson<string> | undefined;

  constructor(
    imei: Imei,
    state:
      | State<
          | typeof ConnectionModule.CONNECTED
          | typeof ConnectionModule.DISCONNECTED
        >
      | undefined = undefined,
    detectedProtocolVersion: State<string> | undefined,
    setProtocolVersion: State<string> | undefined = undefined,
    detectedProtocol: State<string> | undefined = undefined,
    setProtocol: State<string> | undefined
  ) {
    this.imei = imei;
    if (state !== undefined) {
      this.state = new StateJson(
        state.state,
        state.originatedAt?.toISOString(),
        state.updatedAt,
        state.createdAt,
      );
    }

    if (detectedProtocolVersion !== undefined) {
      this.detectedProtocolVersion = new StateJson(
        detectedProtocolVersion.state,
        detectedProtocolVersion.originatedAt?.toISOString(),
        detectedProtocolVersion.updatedAt,
        detectedProtocolVersion.createdAt,
      );
    }

    if (setProtocolVersion !== undefined) {
      this.setProtocolVersion = new StateJson(
        setProtocolVersion.state,
        setProtocolVersion.originatedAt?.toISOString(),
        setProtocolVersion.updatedAt,
        setProtocolVersion.createdAt,
      );
    }

    if (detectedProtocol !== undefined) {
      this.detectedProtocol = new StateJson(
        detectedProtocol.state,
        detectedProtocol.originatedAt?.toISOString(),
        detectedProtocol.updatedAt,
        detectedProtocol.createdAt,
      );
    }

    if (setProtocol !== undefined) {
      this.setProtocol = new StateJson(
        setProtocol.state,
        setProtocol.originatedAt?.toISOString(),
        setProtocol.updatedAt,
        setProtocol.createdAt,
      );
    }
  }
}
