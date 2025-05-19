import { Imei } from "../../../connector/common/src/vehicle/components/iot/network/protocol/Imei.ts";
import { typeNames as modelTypeNames } from "../../../connector/common/src/vehicle/model/models/types.ts";
import { UnlockResponse } from "../adapters/httpClient/responses/v1/vehicle/UnlockResponse.ts";
import { LockResponse } from "../adapters/httpClient/responses/v1/vehicle/LockResponse.ts";
import { LoggerInterface } from "../../../connector/common/src/logger/LoggerInterface.ts";
import { UserApiActions } from "../adapters/connector/UserApiActions.ts";

export class VehicleUserApiActions {
  private _userApiActions: UserApiActions;
  private _imei: Imei;
  private _vehicleId?: number;
  private _logger: LoggerInterface;
  private _ongoingLockRequest: boolean = false;
  private _ongoingUnlockRequest: boolean = false;

  constructor(
    userApiActions: UserApiActions,
    imei: Imei,
    logger: LoggerInterface,
  ) {
    this._userApiActions = userApiActions;
    this._imei = imei;
    this._logger = logger;
  }

  private async init() {
    if (this._vehicleId) {
      return;
    }

    this._vehicleId = await this._userApiActions.getVehicleIdByImei(this._imei);
  }

  public async updateModelName(modelName: modelTypeNames): Promise<boolean> {
    await this.init();

    if (!this._vehicleId) {
      return false;
    }

    return await this._userApiActions.updateModelName(
      this._vehicleId,
      modelName,
    );
  }

  public async unlock(
    trackingId?: string,
  ): Promise<UnlockResponse | undefined> {
    if (this._ongoingUnlockRequest) {
      this._logger.error(
        "Unlock request already ongoing",
        VehicleUserApiActions.name,
      );

      return undefined;
    }

    await this.init();

    if (this._vehicleId === undefined) {
      return undefined;
    }

    this._ongoingUnlockRequest = true;

    const unlocked = await this._userApiActions.unlockVehicle(
      this._vehicleId,
      trackingId,
    );

    //TODO: recover from process never hitting this line, possible?
    this._ongoingUnlockRequest = false;

    return unlocked;
  }

  public async lock(trackingId?: string): Promise<LockResponse | undefined> {
    if (this._ongoingLockRequest) {
      this._logger.error(
        "Lock request already ongoing",
        VehicleUserApiActions.name,
      );

      return undefined;
    }

    await this.init();

    if (this._vehicleId === undefined) {
      return undefined;
    }

    this._ongoingLockRequest = true;

    const locked = await this._userApiActions.lockVehicle(
      this._vehicleId,
      trackingId,
    );

    this._ongoingLockRequest = false;

    return locked;
  }
}
