import { Batteries } from "../../../../components/energy/Batteries.ts";

export interface UpdateEnergyInterface {
  run(toBeUpdated: Batteries, updateBy: Batteries): Batteries;
}
