import { Battery } from "../../../components/energy/Battery.ts";
import { Batteries } from "../../../components/energy/Batteries.ts";
import { JsonVehicleModel } from "../../JsonVehicleModel.ts";
import { Unknown as UnknownModel } from "../../../model/models/Unknown.ts";
import { SetConnectionModules } from "../SetConnectionModules.ts";
import { SetState } from "../SetState.ts";
import { Position } from "../../../components/iot/Position.ts";
import { IoT } from "../../../components/iot/IoT.ts";
import { ConnectionModule } from "../../../components/iot/network/ConnectionModule.ts";
import { Network } from "../../../components/iot/network/Network.ts";
import {State} from "../../../State.ts";

export class Unknown {
  private _setConnectionModules: SetConnectionModules;
  private _setState: SetState;

  constructor(setConnectionModules: SetConnectionModules, setState: SetState) {
    this._setConnectionModules = setConnectionModules;
    this._setState = setState;
  }

  public run(model: JsonVehicleModel): UnknownModel {
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
            voltage
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

      let network = undefined;
      if (model.ioT.network) {
        const jsonConnectionModules = model.ioT.network.connectionModules;

        const connectionModules: ConnectionModule[] =
          this._setConnectionModules.run(jsonConnectionModules);

        network = new Network(connectionModules);
      }
      ioT = new IoT(network, position);
    }

    return new UnknownModel(energy, ioT);
  }
}

export default Unknown;

