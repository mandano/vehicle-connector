import { SimpleUpdate as UpdateSimpleScooter0_1 } from "../../SimpleUpdate.ts";
import { Unknown } from "../../../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";

import { IotBuilder } from "./IotBuilder.ts";
import { PositionBuilder } from "./PositionBuilder.ts";
import { NetworkBuilder } from "./NetworkBuilder.ts";
import { Director } from "./Director.ts";

export class CreateUnknown implements CreateUnknown {
  public run(paket: UpdateSimpleScooter0_1): Unknown | undefined {
    const director = new Director(
      new IotBuilder(new NetworkBuilder(), new PositionBuilder()),
    );

    return director.build(paket);
  }
}
