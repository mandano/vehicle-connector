import { Network } from "../../components/iot/network/Network.ts";
import { Batteries } from "../../components/energy/Batteries.ts";
import { ContainsLockInterface } from "../../components/lock/ContainsLockInterface.ts";
import { Lock } from "../../components/lock/Lock.ts";
import { IoT } from "../../components/iot/IoT.ts";
import { ContainsIotInterface } from "../../components/iot/ContainsIotInterface.ts";
import { ContainsBatteriesInterface } from "../../components/iot/ContainsBatteriesInterface.ts";
import { Speedometer } from "../../components/speedometer/Speedometer.ts";
import { ContainsSpeedometerInterface } from "../../components/speedometer/ContainsSpeedometerInterface.ts";
import { EnergyLevelInterface } from "../../components/energy/EnergyLevelInterface.ts";
import { Odometer } from "../../components/odometer/Odometer.ts";
import { ContainsOdometerInterface } from "../../components/odometer/ContainsOdometerInterface.ts";

export class LockableScooter
  implements
    ContainsLockInterface,
    ContainsIotInterface,
    ContainsBatteriesInterface,
    ContainsSpeedometerInterface,
    ContainsOdometerInterface,
    EnergyLevelInterface
{
  private readonly _network: Network;
  private _batteries?: Batteries;
  private _ioT?: IoT;
  private _lock: Lock;
  private _speedometer?: Speedometer;

  constructor(
    network: Network,
    lock: Lock,
    energy?: Batteries,
    ioT?: IoT,
    speedometer?: Speedometer,
    private _odometer?: Odometer,
  ) {
    this._network = network;
    this._batteries = energy;
    this._ioT = ioT;
    this._lock = lock;
    this._speedometer = speedometer;
  }

  get network(): Network {
    return this._network;
  }

  get batteries(): Batteries | undefined {
    return this._batteries;
  }

  set batteries(energy: Batteries | undefined) {
    this._batteries = energy;
  }

  get ioT(): IoT | undefined {
    return this._ioT;
  }

  set ioT(ioT: IoT | undefined) {
    this._ioT = ioT;
  }

  get lock(): Lock {
    return this._lock;
  }

  set lock(lock: Lock) {
    this._lock = lock;
  }

  get speedometer(): Speedometer | undefined {
    return this._speedometer;
  }

  set speedometer(speedometer: Speedometer | undefined) {
    this._speedometer = speedometer;
  }

  public energyLevel(): number {
    return this._batteries?.getAvgLevel() ?? 0;
  }

  get odometer(): Odometer | undefined {
    return this._odometer;
  }
}

export default LockableScooter;
