import { Lock } from "../../../../modules/protocols/theSimpleProtocol/src/connector/0_1/pakets/lock/Lock.ts";

export class AdHocUpdate {
  constructor(
    private readonly _vehicleId: number,
    private readonly _trackingId: string,
    private readonly _protocolVersion: string,
    private readonly _protocol: string,
    private readonly _paketType: typeof Lock.messageLineKey,
  ) {}

  public get vehicleId(): number {
    return this._vehicleId;
  }

  public get trackingId(): string {
    return this._trackingId;
  }

  public get protocolVersion(): string {
    return this._protocolVersion;
  }

  public get protocol(): string {
    return this._protocol;
  }

  public get paketType(): typeof Lock.messageLineKey {
    return this._paketType;
  }
}
