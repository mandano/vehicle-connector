import { Speedometer } from "../../../../../components/speedometer/Speedometer.ts";

import UpdateSpeedometerResult from "./UpdateSpeedometerResult.ts";

export default interface UpdateSpeedometerInterface {
  run(toBeUpdated: Speedometer, updateBy: Speedometer): UpdateSpeedometerResult;
}
