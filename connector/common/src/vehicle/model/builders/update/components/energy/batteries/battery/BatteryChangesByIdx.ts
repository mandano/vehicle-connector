import BatteryChanges from "./BatteryChanges.ts";

export default class BatteryChangesByIdx {
  constructor(
    public batteryChanges: BatteryChanges,
    public idx: number,
  ) {}
}
