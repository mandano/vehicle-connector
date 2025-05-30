import { SimpleUpdate } from "../../SimpleUpdate.ts";
import { Position } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/Position.ts";
import { State } from "../../../../../../../../../../connector/common/src/vehicle/State.ts";

export class PositionBuilder {
  public build(updateSimpleScooter: SimpleUpdate): Position {
    const latitude = new State(
      updateSimpleScooter.latitude,
      updateSimpleScooter.latitudeOriginatedAt,
      undefined,
      new Date(),
    );
    const longitude = new State(
      updateSimpleScooter.longitude,
      updateSimpleScooter.longitudeOriginatedAt,
      undefined,
      new Date(),
    );

    return new Position(latitude, longitude, new Date(), undefined);
  }
}
