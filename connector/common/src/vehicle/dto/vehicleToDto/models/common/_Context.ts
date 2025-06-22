import BatteriesBuilder from "./BatteriesBuilder.ts";
import ConnectionModuleBuilder from "./ConnectionModuleBuilder.ts";
import IotBuilder from "./IotBuilder.ts";
import LockBuilder from "./LockBuilder.ts";
import NetworkBuilder from "./NetworkBuilder.ts";
import OdometerBuilder from "./OdometerBuilder.ts";
import PositionBuilder from "./PositionBuilder.ts";
import SetState from "./SetStateDto.ts";
import SpeedometerBuilder from "./SpeedometerBuilder.ts";

export default class Context {
  private _batteriesBuilder: BatteriesBuilder | undefined;
  private _connectionModuleBuilder: ConnectionModuleBuilder | undefined;
  private _iotBuilder: IotBuilder | undefined;
  private _lockBuilder: LockBuilder | undefined;
  private _networkBuilder: NetworkBuilder | undefined;
  private _odometerBuilder: OdometerBuilder | undefined;
  private _positionBuilder: PositionBuilder | undefined;
  private _setState: SetState | undefined;
  private _speedometerBuilder: SpeedometerBuilder | undefined;

  public setState(): SetState {
    if (!this._setState) {
      this._setState = new SetState();
    }

    return this._setState;
  }

  public batteriesBuilder(): BatteriesBuilder {
    if (!this._batteriesBuilder) {
      this._batteriesBuilder = new BatteriesBuilder(this.setState());
    }

    return this._batteriesBuilder;
  }

  private connectionModuleBuilder(): ConnectionModuleBuilder {
    if (!this._connectionModuleBuilder) {
      this._connectionModuleBuilder = new ConnectionModuleBuilder(this.setState());
    }

    return this._connectionModuleBuilder;
  }

  public iotBuilder(): IotBuilder {
    if (!this._iotBuilder) {
      this._iotBuilder = new IotBuilder(this.networkBuilder(), this.positionBuilder());
    }

    return this._iotBuilder;
  }

  public lockBuilder(): LockBuilder {
    if (!this._lockBuilder) {
      this._lockBuilder = new LockBuilder(this.setState());
    }

    return this._lockBuilder;
  }

  private networkBuilder(): NetworkBuilder {
    if (!this._networkBuilder) {
      this._networkBuilder = new NetworkBuilder(this.connectionModuleBuilder());
    }

    return this._networkBuilder;
  }

  public speedometerBuilder(): SpeedometerBuilder {
    if (!this._speedometerBuilder) {
      this._speedometerBuilder = new SpeedometerBuilder(this.setState());
    }

    return this._speedometerBuilder;
  }

  public odometerBuilder(): OdometerBuilder {
    if (!this._odometerBuilder) {
      this._odometerBuilder = new OdometerBuilder(this.setState());
    }

    return this._odometerBuilder;
  }

  private positionBuilder(): PositionBuilder {
    if (!this._positionBuilder) {
      this._positionBuilder = new PositionBuilder(this.setState());
    }
    return this._positionBuilder;
  }
}