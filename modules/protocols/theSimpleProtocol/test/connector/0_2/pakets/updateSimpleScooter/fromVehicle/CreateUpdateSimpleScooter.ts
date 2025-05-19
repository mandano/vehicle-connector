import { faker } from "@faker-js/faker";

import { SimpleUpdate } from "../../../../../../src/connector/0_2/pakets/simpleUpdate/SimpleUpdate.ts";
import { ID_0_2 } from "../../../../../../src/versions.ts";

export class CreateUpdateSimpleScooter {
  public run(
    updateSimpleScooter?: Partial<SimpleUpdate>,
  ): SimpleUpdate {
    return new SimpleUpdate(
      updateSimpleScooter?.imei ?? faker.phone.imei(),
      ID_0_2,
      new Date(),
      updateSimpleScooter && "latitude" in updateSimpleScooter ? updateSimpleScooter.latitude: faker.location.latitude(),
      updateSimpleScooter?.latitudeOriginatedAt ?? new Date(),
      updateSimpleScooter && "longitude" in updateSimpleScooter ? updateSimpleScooter.longitude : faker.location.longitude(),
      updateSimpleScooter?.longitudeOriginatedAt ?? new Date(),
      updateSimpleScooter?.mileage ?? faker.number.int(),
      updateSimpleScooter?.mileageOriginatedAt ?? new Date(),
      updateSimpleScooter?.energy ?? faker.number.int(),
      updateSimpleScooter?.energyOriginatedAt ?? new Date(),
      updateSimpleScooter?.speed ?? faker.number.int(),
      updateSimpleScooter?.speedOriginatedAt ?? new Date(),
      updateSimpleScooter?.trackingId ?? undefined,
    );
  }
}
