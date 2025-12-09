import Speedometer from "../../../../../components/speedometer/Speedometer.ts";
import Odometer from "../../../../../components/odometer/Odometer.ts";
import BatteriesChanges from "../../components/energy/batteries/BatteriesChanges.ts";
import IotChanges from "../../components/ioT/IotChanges.ts";
import LockChanges from "../../../../../components/lock/LockChanges.ts";

export default class LockableScooterChanges {
  constructor(
    public lock?: LockChanges,
    public batteries?: BatteriesChanges,
    public ioT?: IotChanges,
    public speedometer?: Speedometer,
    public odometer?: Odometer,
  ) {}
}
