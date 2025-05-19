import { ID_0_1 } from "../../../../versions.ts";

import { SimpleUpdate } from "./SimpleUpdate.ts";

export class CreateSimpleUpdate {
  public run(
    simpleSimpleUpdate: Partial<SimpleUpdate>,
  ): SimpleUpdate {
    return new SimpleUpdate(
      simpleSimpleUpdate?.latitude ?? 0,
      simpleSimpleUpdate?.latitudeOriginatedAt ?? new Date(),
      simpleSimpleUpdate?.longitude ?? 0,
      simpleSimpleUpdate?.longitudeOriginatedAt ?? new Date(),
      simpleSimpleUpdate?.imei ?? "",
      ID_0_1,
      new Date(),
    );
  }
}
