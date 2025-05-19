import { Speedometer } from "./Speedometer.ts";

export interface ContainsSpeedometerInterface {
  get speedometer(): Speedometer | undefined;
}
