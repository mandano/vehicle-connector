import { Batteries } from "../../components/energy/Batteries.ts";
import { IoT } from "../../components/iot/IoT.ts";
import { Lock } from "../../components/lock/Lock.ts";
import { ContainsIotInterface } from "../../components/iot/ContainsIotInterface.ts";
import { Speedometer } from "../../components/speedometer/Speedometer.ts";
import { ContainsSpeedometerInterface } from "../../components/speedometer/ContainsSpeedometerInterface.ts";
import { EnergyLevelInterface } from "../../components/energy/EnergyLevelInterface.ts";
import { Odometer } from "../../components/odometer/Odometer.ts";

export class Unknown
  implements
    ContainsIotInterface,
    ContainsSpeedometerInterface,
    EnergyLevelInterface
{
  private _batteries?: Batteries;
  private _ioT?: IoT;
  private _lock?: Lock;
  private readonly _speedometer?: Speedometer;

  constructor(
    batteries?: Batteries | undefined,
    iot?: IoT,
    lock?: Lock,
    speedometer?: Speedometer,
    private _odometer?: Odometer,
  ) {
    this._batteries = batteries;
    this._ioT = iot;
    this._lock = lock;
    this._speedometer = speedometer;
  }

  get batteries(): Batteries | undefined {
    return this._batteries;
  }

  set batteries(batteries: Batteries | undefined) {
    this._batteries = batteries;
  }

  get ioT(): IoT | undefined {
    return this._ioT;
  }

  set ioT(iot: IoT) {
    this._ioT = iot;
  }

  get lock(): Lock | undefined {
    return this._lock;
  }

  set lock(lock: Lock) {
    this._lock = lock;
  }

  get speedometer(): Speedometer | undefined {
    return this._speedometer;
  }

  public energyLevel(): number {
    return this._batteries?.getAvgLevel() ?? 0;
  }

  get odometer(): Odometer | undefined {
    return this._odometer;
  }

  set odometer(odometer: Odometer | undefined) {
    this._odometer = odometer;
  }
}

export default Unknown;
