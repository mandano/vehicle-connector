import Network from "./Network.ts";
import CloneConnectionModules from "./CloneConnectionModules.ts";

export default class CloneNetwork {
  constructor(private _cloneConnectionModules: CloneConnectionModules) {}

  public run(network: Network): Network {
    const connectionModules = this._cloneConnectionModules.run(
      network.connectionModules,
    );

    return new Network(connectionModules);
  }
}
