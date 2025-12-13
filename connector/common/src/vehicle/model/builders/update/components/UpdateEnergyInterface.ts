import { Batteries } from "../../../../components/energy/Batteries.ts";

import UpdateBatteriesResult from "./energy/batteries/UpdateBatteriesResult.ts";

export default interface UpdateEnergyInterface {
  run(toBeUpdated: Batteries, updateBy: Batteries): UpdateBatteriesResult;
}
