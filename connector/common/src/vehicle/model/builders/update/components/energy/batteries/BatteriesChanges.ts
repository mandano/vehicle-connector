import BatteryChangesByIdx from "./battery/BatteryChangesByIdx.ts";

export default class BatteriesChanges {
  constructor(public batteries: BatteryChangesByIdx[] = []) {}
}
