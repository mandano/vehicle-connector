import { Batteries } from "../energy/Batteries.ts";

export interface ContainsBatteriesInterface {
  get batteries(): Batteries | undefined;
}
