import StateDtoChanges from "../../../../../../../components/state/StateDtoChanges.ts";

export default class BatteryChanges {
  constructor(
    public voltage?: StateDtoChanges<number>,
    public level?: StateDtoChanges<number>,
  ) {}
}
