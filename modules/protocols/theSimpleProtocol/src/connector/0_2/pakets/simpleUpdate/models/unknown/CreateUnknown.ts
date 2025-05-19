import { SimpleUpdate } from "../../SimpleUpdate.ts";
import { Unknown } from "../../../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";

import { CreateUnknownInterface } from "./CreateUnknownInterface.ts";
import { IotBuilder } from "./IotBuilder.ts";
import { PositionBuilder } from "./PositionBuilder.ts";
import { NetworkBuilder } from "./NetworkBuilder.ts";
import { Director } from "./Director.ts";
import { SpeedometerBuilder } from "./SpeedometerBuilder.ts";
import { BatteriesBuilder } from "./BatteriesBuilder.ts";

export class CreateUnknown implements CreateUnknownInterface {
  public run(paket: SimpleUpdate): Unknown | undefined {
    const director = new Director(
      new IotBuilder(new NetworkBuilder(), new PositionBuilder()),
      new SpeedometerBuilder(),
      new BatteriesBuilder(),
    );

    return director.build(paket);
  }
}

export default CreateUnknown;
