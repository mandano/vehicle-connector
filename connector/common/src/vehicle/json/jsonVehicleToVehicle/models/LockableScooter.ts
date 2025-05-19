import { Battery } from "../../../components/energy/Battery.ts";
import { Batteries } from "../../../components/energy/Batteries.ts";
import { JsonVehicleModel } from "../../JsonVehicleModel.ts";
import { SetConnectionModules } from "../SetConnectionModules.ts";
import { SetState } from "../SetState.ts";
import { Position } from "../../../components/iot/Position.ts";
import { IoT } from "../../../components/iot/IoT.ts";
import { ConnectionModule } from "../../../components/iot/network/ConnectionModule.ts";
import { Network } from "../../../components/iot/network/Network.ts";
import { LockableScooter as LockableScooterModel } from "../../../model/models/LockableScooter.ts";
import { SendActionRequest } from "../../../model/actions/SendActionRequest.ts";
import { Lock } from "../../../components/lock/Lock.ts";
import { Speedometer } from "../../../components/speedometer/Speedometer.ts";
import {State} from "../../../State.ts";


export class LockableScooter {
  private _setConnectionModules: SetConnectionModules;
  private _setState: SetState;
  private readonly _sendActionRequest: SendActionRequest;

  constructor(
    setConnectionModules: SetConnectionModules,
    setState: SetState,
    sendActionRequest: SendActionRequest,
  ) {
    this._setConnectionModules = setConnectionModules;
    this._setState = setState;
    this._sendActionRequest = sendActionRequest;
  }

  public run(model: JsonVehicleModel): LockableScooterModel {
    const jsonConnectionModules = model.ioT?.network?.connectionModules;

    let connectionModules: ConnectionModule[] = [];

    if (jsonConnectionModules !== undefined) {
      connectionModules = this._setConnectionModules.run(jsonConnectionModules);
    }

    const network = new Network(connectionModules);

    const batteries: Battery[] = [];

    const energyJson = model.energy;

    if (energyJson !== undefined) {
      const batteriesJson = energyJson.batteries;

      for (const batteryJson of batteriesJson) {
        let voltage: State<number> | undefined;

        if (batteryJson.voltage !== undefined) {
          voltage = this._setState.run(batteryJson.voltage);
        }

        batteries.push(
          new Battery(
            this._setState.run(batteryJson.level),
            voltage,
          ),
        );
      }
    }

    const energy = new Batteries(batteries);

    let ioT = undefined;

    if (model.ioT) {
      let position = undefined;

      if (model.ioT.position) {
        let accuracy = undefined;
        if (model.ioT.position.accuracy) {
          accuracy = this._setState.run(model.ioT.position.accuracy);
        }

        position = new Position(
          this._setState.run(model.ioT.position.latitude),
          this._setState.run(model.ioT.position.longitude),
          model.ioT.position.createdAt,
          accuracy,
        );
      }

      ioT = new IoT(network, position);
    }

    let lock: Lock | undefined;
    if (model.lock) {
      lock = new Lock(
        this._sendActionRequest,
        this._setState.run(model.lock.state),
      );
    } else {
      lock = new Lock(this._sendActionRequest, undefined);
    }

    let speedometer: Speedometer | undefined;

    if ("speedometer" in model && Speedometer.isSpeedometer(model.speedometer)) {
      speedometer = new Speedometer(
        this._setState.run(model.speedometer.state),
      );
    }

    return new LockableScooterModel(network, lock, energy, ioT, speedometer);
  }
}

export default LockableScooter;
