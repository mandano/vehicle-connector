import State from "../../State.ts";

import Speedometer from "./Speedometer.ts";

export default class SpeedometerAlike {
  public static run(obj: unknown): obj is Speedometer {
    return (
      (obj as Speedometer).state !== undefined &&
      (obj as Speedometer).state !== null &&
      State.isState((obj as Speedometer).state)
    );
  }
}
