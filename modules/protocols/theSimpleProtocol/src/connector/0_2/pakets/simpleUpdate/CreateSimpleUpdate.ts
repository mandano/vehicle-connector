import { ID_0_2 } from "../../../../versions.ts";

import { SimpleUpdate } from "./SimpleUpdate.ts";

export class CreateSimpleUpdate {
  public run(
    updateSimpleScooter: Partial<SimpleUpdate>,
  ): SimpleUpdate | undefined {
    if (updateSimpleScooter.imei === undefined) {
      return undefined;
    }

    return new SimpleUpdate(
      updateSimpleScooter.imei,
      ID_0_2,
      updateSimpleScooter.originatedAt ?? new Date(),
      updateSimpleScooter.latitude,
      updateSimpleScooter.latitudeOriginatedAt,
      updateSimpleScooter.longitude,
      updateSimpleScooter.longitudeOriginatedAt,
      updateSimpleScooter.mileage,
      updateSimpleScooter.mileageOriginatedAt,
      updateSimpleScooter.energy,
      updateSimpleScooter.energyOriginatedAt,
      updateSimpleScooter.speed,
      updateSimpleScooter.speedOriginatedAt,
      updateSimpleScooter.trackingId,
    );
  }
}

export default CreateSimpleUpdate;
