import SendActionRequestInterface from "../../../model/actions/SendActionRequestInterface.ts";

import FromUnknownDto from "./FromUnknownDto.ts";
import CommonContext from "./common/_Context.ts";
import FromLockableScooterDto from "./FromLockableScooterDto.ts";

export default class _Context {
  private _common: CommonContext | undefined;

  constructor(
    private readonly _sendActionRequest: SendActionRequestInterface,
  ) {}

  public fromLockableScooterDto(): FromLockableScooterDto {
    return new FromLockableScooterDto(
      this.common().iotBuilder(),
      this.common().batteriesBuilder(),
      this.common().odometerBuilder(),
      this.common().speedometerBuilder(),
      this.common().lockBuilder(),
      this._sendActionRequest,
    );
  }

  public fromUnknownDto(): FromUnknownDto {
    return new FromUnknownDto(
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
