
import BatteriesChanges from "../../builders/update/components/energy/batteries/BatteriesChanges.ts";
import IotChanges from "../../builders/update/components/ioT/IotChanges.ts";
import StateDtoChanges from "../../../components/state/StateDtoChanges.ts";
import LockStates from "../../../components/lock/LockStates.ts";

export default class UnknownChanges {
  constructor(
    public batteries?: BatteriesChanges,
    public ioT?: IotChanges,
    public lock?: StateDtoChanges<LockStates>,
    public speedometer?: StateDtoChanges<number>,
    public odometer?: StateDtoChanges<number>,
  ) {}
}
