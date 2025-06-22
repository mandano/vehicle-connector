import ToUnknownDto from "./ToUnknownDto.ts";
import CommonContext from "./common/_Context.ts";
import ToLockableScooterDto from "./ToLockableScooterDto.ts";

export default class _Context {
  private _common: CommonContext | undefined;

  public toLockableScooterDto(): ToLockableScooterDto {
    return new ToLockableScooterDto(
      this.common().iotBuilder(),
      this.common().batteriesBuilder(),
      this.common().odometerBuilder(),
      this.common().speedometerBuilder(),
      this.common().lockBuilder(),
    );
  }

  public toUnknownDto(): ToUnknownDto {
    return new ToUnknownDto(
      this.common().iotBuilder(),
      this.common().batteriesBuilder(),
      this.common().odometerBuilder(),
      this.common().speedometerBuilder(),
      this.common().lockBuilder(),
    );
  }

  public common(): CommonContext {
    if (this._common === undefined) {
      this._common = new CommonContext();
    }

    return this._common;
  }
}
