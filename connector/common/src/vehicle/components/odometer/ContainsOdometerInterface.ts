import { Odometer } from "./Odometer.ts";

export interface ContainsOdometerInterface {
  get odometer(): Odometer | undefined;
}
