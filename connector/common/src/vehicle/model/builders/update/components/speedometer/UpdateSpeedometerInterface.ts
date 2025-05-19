import { Speedometer } from "../../../../../components/speedometer/Speedometer.ts";

export interface UpdateSpeedometerInterface {
  run(toBeUpdated: Speedometer, updateBy: Speedometer): Speedometer;
}
