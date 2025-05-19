import { faker } from "@faker-js/faker";

import { SimpleUpdate } from "../../../../../src/connector/0_1/pakets/simpleUpdate/SimpleUpdate.ts";
import { ID_0_1 } from "../../../../../src/versions.ts";

export class CreateUpdateSimpleScooter {
  public run(
    updateSimpleScooter?: Partial<SimpleUpdate>,
  ): SimpleUpdate {
    return new SimpleUpdate(
      updateSimpleScooter?.latitude ?? faker.location.latitude(),
      updateSimpleScooter?.latitudeOriginatedAt ?? new Date(),
      updateSimpleScooter?.longitude ?? faker.location.longitude(),
      updateSimpleScooter?.longitudeOriginatedAt ?? new Date(),
      updateSimpleScooter?.imei ?? faker.phone.imei(),
      ID_0_1,
      new Date(),
      updateSimpleScooter?.trackingId ?? undefined,
    );
  }
}
