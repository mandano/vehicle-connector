import { SimpleUpdate } from "../../SimpleUpdate.ts";
import { Unknown } from "../../../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";

import { IotBuilder } from "./IotBuilder.ts";

export class Director {
  constructor(private _ioTBuilder: IotBuilder) {}

  public build(updateSimpleScooter: SimpleUpdate): Unknown {
    const ioT = this._ioTBuilder.build(updateSimpleScooter);

    return new Unknown(undefined, ioT, undefined, undefined);
  }
}
