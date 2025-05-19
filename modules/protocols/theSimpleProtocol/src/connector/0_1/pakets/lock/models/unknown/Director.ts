import { Unknown } from "../../../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { Lock } from "../../Lock.ts";

import { LockBuilder } from "./LockBuilder.ts";
import { IotBuilder } from "./IotBuilder.ts";

export class Director {
  constructor(
    private _lockBuilder: LockBuilder,
    private _ioTBuilder: IotBuilder,
  ) {}

  public build(lock: Lock): Unknown {
    const ioT = this._ioTBuilder.build(lock);
    const lockComponent = this._lockBuilder.build(lock);

    return new Unknown(undefined, ioT, lockComponent, undefined);
  }
}
