import IsStateDto from "../../components/state/IsStateDto.ts";
import IsStringStateDto from "../../components/state/IsStringStateDto.ts";
import IsConnectionStateDto from "../../components/iot/network/IsConnectionStateDto.ts";
import IsLockStateDto from "../../components/lock/IsLockStateDto.ts";
import IsIotDto from "../../components/iot/IsIotDto.ts";
import IsPositionDto from "../../components/iot/position/IsPositionDto.ts";
import IsConnectionModuleDto from "../../components/iot/network/IsConnectionModuleDto.ts";
import IsNetworkDto from "../../components/iot/network/IsNetworkDto.ts";
import IsNumberStateDto from "../../components/state/IsNumberStateDto.ts";
import IsOdometerDto from "../../components/odometer/IsOdometerDto.ts";
import IsSpeedometerDto from "../../components/speedometer/IsSpeedometerDto.ts";

import ObjectToDto from "./ObjectToDto.ts";
import ToLockableScooterDto from "./ToLockableScooterDto.ts";
import CommonContext from "./common/_Context.ts";
import ToUnknownDto from "./ToUnknownDto.ts";

export default class _Context {
  private _common: CommonContext | undefined;
  private _objectToDto: ObjectToDto | undefined;

  private fromLockableScooterDto(): ToLockableScooterDto {
    return new ToLockableScooterDto(
      this.common().lockBuilder(),
      this.common().batteriesBuilder(),
      this.common().iotBuilder(),
      this.common().speedometerBuilder(),
      this.common().odometerBuilder(),
    );
  }

  private fromUnknownDto(): ToUnknownDto {
    return new ToUnknownDto(
      this.common().lockBuilder(),
      this.common().batteriesBuilder(),
      this.common().iotBuilder(),
      this.common().speedometerBuilder(),
      this.common().odometerBuilder(),
    );
  }

  private common(): CommonContext {
    if (this._common === undefined) {
      const isStateDto = new IsStateDto();
      const isStringStateDto = new IsStringStateDto(isStateDto);
      const isNumberStateDto = new IsNumberStateDto(isStateDto);
      const isConnectionStateDto = new IsConnectionStateDto(isStateDto);
      const isConnectionModuleDto = new IsConnectionModuleDto(
        isConnectionStateDto,
      );
      const isNetworkDto = new IsNetworkDto(isConnectionModuleDto);
      const isPositionDto = new IsPositionDto(isNumberStateDto);
      const isOdometerDto = new IsOdometerDto(isNumberStateDto);
      const isSpeedometerDto = new IsSpeedometerDto(isNumberStateDto);

      this._common = new CommonContext(
        new IsStateDto(),
        isStringStateDto,
        new IsConnectionStateDto(isStateDto),
        new IsLockStateDto(isStringStateDto),
        new IsIotDto(isNetworkDto, isPositionDto),
        isPositionDto,
        isConnectionModuleDto,
        isNetworkDto,
        isOdometerDto,
        isSpeedometerDto,
      );
    }

    return this._common;
  }

  public objectToDto(): ObjectToDto {
    if (!this._objectToDto) {
      this._objectToDto = new ObjectToDto(
        this.fromUnknownDto(),
        this.fromLockableScooterDto(),
      );
    }

    return this._objectToDto;
  }
}
