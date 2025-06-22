import { Unknown } from "../../../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import LockPaket from "../../Lock.ts";

import { LockBuilder } from "./LockBuilder.ts";
import { IotBuilder } from "./IotBuilder.ts";

export class Director {
  constructor(
    private _lockBuilder: LockBuilder,
    private _ioTBuilder: IotBuilder,
  ) {}

  public build(lockPaket: LockPaket): Unknown {
    const ioT = this._ioTBuilder.build(lockPaket);
    const lock = this._lockBuilder.build(lockPaket);

    return new Unknown(undefined, ioT, lock, undefined);
  }
}
