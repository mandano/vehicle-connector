import { SimpleUpdate } from "../../SimpleUpdate.ts";
import { State } from "../../../../../../../../../../connector/common/src/vehicle/State.ts";
import { Battery } from "../../../../../../../../../../connector/common/src/vehicle/components/energy/Battery.ts";
import { Batteries } from "../../../../../../../../../../connector/common/src/vehicle/components/energy/Batteries.ts";

export class BatteriesBuilder {
  public build(
    updateSimpleScooter: SimpleUpdate,
  ): Batteries | undefined {
    if (
      updateSimpleScooter.energy === undefined ||
      updateSimpleScooter.energyOriginatedAt === undefined
    ) {
      return undefined;
    }

    const battery = new State(
      updateSimpleScooter.energy,
      updateSimpleScooter.energyOriginatedAt,
      undefined,
      new Date(),
    );

    return new Batteries([new Battery(battery)]);
  }
}
