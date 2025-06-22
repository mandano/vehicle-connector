import { faker } from "@faker-js/faker";

import { Position } from "../../../../src/vehicle/components/iot/Position.ts";
import { State } from "../../../../src/vehicle/State.ts";

export class CreatePosition {
  public run(options?: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  }): Position {
    return new Position(
      new State(
        options?.latitude ?? faker.location.latitude(),
        new Date(),
        new Date(),
        new Date(),
      ),
      new State(
        options?.longitude ?? faker.location.longitude(),
        new Date(),
        new Date(),
        new Date(),
      ),
      new Date(),
      new State(
        options?.accuracy ?? faker.number.int({ min: 1, max: 5 }),
        new Date(),
        new Date(),
        new Date(),
      ),
    );
  }
}

export default CreatePosition;
