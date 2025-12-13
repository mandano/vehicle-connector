import { faker } from "@faker-js/faker";

import State from "../../../../src/vehicle/State.ts";
import Speedometer from "../../../../src/vehicle/components/speedometer/Speedometer.ts";

export default class CreateSpeedometer {
  public run(): Speedometer {
    return new Speedometer(
      new State(
        faker.number.int({ min: 0, max: 100 }),
        new Date(),
        new Date(),
        new Date(),
      ),
    );
  }
}
