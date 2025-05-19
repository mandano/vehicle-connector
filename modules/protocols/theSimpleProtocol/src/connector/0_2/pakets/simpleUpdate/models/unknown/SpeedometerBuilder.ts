import { SimpleUpdate } from "../../SimpleUpdate.ts";
import { State } from "../../../../../../../../../../connector/common/src/vehicle/State.ts";
import { Speedometer } from "../../../../../../../../../../connector/common/src/vehicle/components/speedometer/Speedometer.ts";

export class SpeedometerBuilder {
  public build(
    updateSimpleScooter: SimpleUpdate,
  ): Speedometer | undefined {
    if (
      updateSimpleScooter.speed === undefined ||
      updateSimpleScooter.speedOriginatedAt === undefined
    ) {
      return undefined;
    }

    const speed = new State(
      updateSimpleScooter.speed,
      updateSimpleScooter.speedOriginatedAt,
      undefined,
      new Date(),
    );

    return new Speedometer(speed);
  }
}
