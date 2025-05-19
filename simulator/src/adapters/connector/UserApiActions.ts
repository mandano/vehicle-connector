import { UnlockResponse } from "../httpClient/responses/v1/vehicle/UnlockResponse.ts";
import { LockResponse } from "../httpClient/responses/v1/vehicle/LockResponse.ts";
import HttpClient from "../httpClient/HttpClient.ts";
import { Imei } from "../../../../connector/common/src/vehicle/components/iot/network/protocol/Imei.ts";
import { JsonVehicle } from "../../../../connector/common/src/vehicle/json/JsonVehicle.ts";
import { typeNames as modelTypeNames } from "../../../../connector/common/src/vehicle/model/models/types.ts";
import { ModelNameResponse } from "../httpClient/responses/v1/vehicle/ModelNameResponse.ts";
import { HashColoredLoggerInterface } from "../../../../connector/common/src/logger/HashColoredLoggerInterface.ts";

export class UserApiActions {
  private _httpClient: HttpClient;
  private _hashColoredLogger: HashColoredLoggerInterface;

  constructor(
    httpClient: HttpClient,
    hashColoredLogger: HashColoredLoggerInterface,
  ) {
    this._httpClient = httpClient;
    this._hashColoredLogger = hashColoredLogger;
  }

  public async updateModelName(
    vehicleId: number,
    modelName: modelTypeNames,
  ): Promise<boolean> {
    const url = `/api/v1/vehicle/${vehicleId}/modelName`;
    const response = await this._httpClient.put(url, { modelName: modelName });

    if (!this.isModelNameResponse(response)) {
      return false;
    }

    const modelNameResponse = new ModelNameResponse(response.message);

    return modelNameResponse.isSuccess();
  }

  private isModelNameResponse(
    response: unknown,
  ): response is ModelNameResponse {
    return (
      response !== undefined &&
      (response as ModelNameResponse).message !== undefined
    );
  }

  public async unlockVehicle(
    vehicleId: number,
    trackingId?: string,
  ): Promise<UnlockResponse | undefined> {
    const url = `/api/v1/vehicle/${vehicleId}/unlock`;

    let payload = {};

    if (trackingId !== undefined) {
      payload = { trackingId: trackingId };

      this._hashColoredLogger.debug(
        `Unlocking vehicle with trackingId: ${trackingId}`,
        trackingId.slice(-4),
        UnlockResponse.name,
      );
    }

    const response = await this._httpClient.post(url, payload);

    if (!this.isUnlockResponse(response)) {
      return undefined;
    }

    return new UnlockResponse(response.message);
  }

  private isUnlockResponse(response: unknown): response is UnlockResponse {
    return (
      response !== undefined &&
      (response as UnlockResponse).message !== undefined
    );
  }

  public async lockVehicle(
    vehicleId: number,
    trackingId?: string,
  ): Promise<LockResponse | undefined> {
    const url = `/api/v1/vehicle/${vehicleId}/lock`;

    let payload = {};

    if (trackingId !== undefined) {
      payload = { trackingId: trackingId };

      this._hashColoredLogger.debug(
        `Locking vehicle with trackingId: ${trackingId}`,
        trackingId.slice(-4),
        UnlockResponse.name,
      );
    }
    const response = await this._httpClient.post(url, payload);

    if (!this.isLockResponse(response)) {
      return undefined;
    }

    return new LockResponse(response.message);
  }

  private isLockResponse(response: unknown): response is LockResponse {
    return (
      response !== undefined && (response as LockResponse).message !== undefined
    );
  }

  public async getVehicleIdByImei(imei: Imei): Promise<number | undefined> {
    const url = `/api/v1/vehicle/${imei}`;
    const jsonVehicle = await this._httpClient.get(url);

    if (!this.isJsonVehicle(jsonVehicle)) {
      return undefined;
    }

    return jsonVehicle.id;
  }

  private isJsonVehicle(response: unknown): response is JsonVehicle {
    return (
      response !== undefined &&
      (response as JsonVehicle).id !== undefined &&
      (response as JsonVehicle).model !== undefined &&
      (response as JsonVehicle).createdAt !== undefined
    );
  }
}
