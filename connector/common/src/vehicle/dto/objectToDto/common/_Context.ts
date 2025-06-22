import IsStringStateDto from "../../../components/state/IsStringStateDto.ts";
import IsNumberStateDto from "../../../components/state/IsNumberStateDto.ts";
import IsStateDto from "../../../components/state/IsStateDto.ts";
import IsBatteryDto from "../../../components/energy/IsBatteryDto.ts";
import IsConnectionStateDto from "../../../components/iot/network/IsConnectionStateDto.ts";
import IsLockStateDto from "../../../components/lock/IsLockStateDto.ts";
import IsIotDto from "../../../components/iot/IsIotDto.ts";
import IsPositionDto from "../../../components/iot/position/IsPositionDto.ts";
import IsConnectionModuleDto from "../../../components/iot/network/IsConnectionModuleDto.ts";
import IsNetworkDto from "../../../components/iot/network/IsNetworkDto.ts";
import IsOdometerDto from "../../../components/odometer/IsOdometerDto.ts";
import IsSpeedometerDto from "../../../components/speedometer/IsSpeedometerDto.ts";

import BatteriesBuilder from "./BatteriesBuilder.ts";
import ConnectionModuleBuilder from "./ConnectionModuleBuilder.ts";
import IotBuilder from "./IotBuilder.ts";
import LockBuilder from "./LockBuilder.ts";
import NetworkBuilder from "./NetworkBuilder.ts";
import OdometerBuilder from "./OdometerBuilder.ts";
import PositionBuilder from "./PositionBuilder.ts";
import SetStateDto from "./SetStateDto.ts";
import SpeedometerBuilder from "./SpeedometerBuilder.ts";

export default class Context {
  private _batteriesBuilder: BatteriesBuilder | undefined;
  private _connectionModuleBuilder: ConnectionModuleBuilder | undefined;
  private _iotBuilder: IotBuilder | undefined;
  private _lockBuilder: LockBuilder | undefined;
  private _networkBuilder: NetworkBuilder | undefined;
  private _odometerBuilder: OdometerBuilder | undefined;
  private _positionBuilder: PositionBuilder | undefined;
  private _setState: SetStateDto | undefined;
  private _speedometerBuilder: SpeedometerBuilder | undefined;

  constructor(
    private readonly _isStateDto: IsStateDto,
    private readonly _isStringStateDto: IsStringStateDto,
    private readonly _isConnectionStateDto: IsConnectionStateDto,
    private readonly _isLockStateDto: IsLockStateDto,
    private readonly _isIotDto: IsIotDto,
    private readonly _isPositionDto: IsPositionDto,
    private readonly _isConnectionModuleDto: IsConnectionModuleDto,
    private readonly _isNetworkDto: IsNetworkDto,
    private readonly _isOdometerDto: IsOdometerDto,
    private readonly _isSpeedometerDto: IsSpeedometerDto,
  ) {}

  public setStateDto(): SetStateDto {
    if (!this._setState) {
      this._setState = new SetStateDto(this._isStateDto);
    }

    return this._setState;
  }

  public batteriesBuilder(): BatteriesBuilder {
    if (!this._batteriesBuilder) {
      this._batteriesBuilder = new BatteriesBuilder(
        this.setStateDto(),
        new IsBatteryDto(new IsNumberStateDto(this._isStateDto)),
      );
    }

    return this._batteriesBuilder;
  }

  private connectionModuleBuilder(): ConnectionModuleBuilder {
    if (!this._connectionModuleBuilder) {
      this._connectionModuleBuilder = new ConnectionModuleBuilder(
        this.setStateDto(),
        this._isStringStateDto,
        this._isConnectionStateDto,
        this._isConnectionModuleDto,
      );
    }

    return this._connectionModuleBuilder;
  }

  public iotBuilder(): IotBuilder {
    if (!this._iotBuilder) {
      this._iotBuilder = new IotBuilder(
        this.networkBuilder(),
        this.positionBuilder(),
        this._isIotDto,
      );
    }

    return this._iotBuilder;
  }

  public lockBuilder(): LockBuilder {
    if (!this._lockBuilder) {
      this._lockBuilder = new LockBuilder(
        this.setStateDto(),
        this._isLockStateDto,
      );
    }

    return this._lockBuilder;
  }

  private networkBuilder(): NetworkBuilder {
    if (!this._networkBuilder) {
      this._networkBuilder = new NetworkBuilder(
        this.connectionModuleBuilder(),
        this._isNetworkDto,
      );
    }

    return this._networkBuilder;
  }

  public speedometerBuilder(): SpeedometerBuilder {
    if (!this._speedometerBuilder) {
      this._speedometerBuilder = new SpeedometerBuilder(
        this.setStateDto(),
        this._isSpeedometerDto,
      );
    }

    return this._speedometerBuilder;
  }

  public odometerBuilder(): OdometerBuilder {
    if (!this._odometerBuilder) {
      this._odometerBuilder = new OdometerBuilder(
        this.setStateDto(),
        this._isOdometerDto,
      );
    }

    return this._odometerBuilder;
  }

  private positionBuilder(): PositionBuilder {
    if (!this._positionBuilder) {
      this._positionBuilder = new PositionBuilder(
        this.setStateDto(),
        this._isPositionDto,
      );
    }
    return this._positionBuilder;
  }
}
