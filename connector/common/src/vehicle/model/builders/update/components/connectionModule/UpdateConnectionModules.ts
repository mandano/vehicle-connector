import ConnectionModule from "../../../../../components/iot/network/ConnectionModule.ts";
import CloneConnectionModule from "../../../../../components/iot/network/CloneConnectionModule.ts";

import UpdateConnectionModule from "./UpdateConnectionModule.ts";

export default class UpdateConnectionModules {
  constructor(
    private readonly _updateConnectionModule: UpdateConnectionModule,
    private readonly _cloneConnectionModule: CloneConnectionModule,
  ) {}

  public run(
    toBeUpdated: ConnectionModule[],
    updateBy: ConnectionModule[],
  ): ConnectionModule[] {
    const connectionModules: ConnectionModule[] = [];

    for (const updateByConnectionModule of updateBy) {
      const toBeUpdatedConnectionModuleIdx = toBeUpdated.findIndex(
        (toBeUpdatedConnectionModule) =>
          toBeUpdatedConnectionModule.imei === updateByConnectionModule.imei,
      );

      if (toBeUpdatedConnectionModuleIdx === -1) {
        const connectionModule = this._cloneConnectionModule.run(
          updateByConnectionModule,
        );

        connectionModules.push(connectionModule);
        continue;
      }

      const connectionModule = this._updateConnectionModule.run(
        toBeUpdated[toBeUpdatedConnectionModuleIdx],
        updateByConnectionModule,
      );

      connectionModules.push(connectionModule);
    }

    const notToBeUpdated = toBeUpdated
      .filter((module) => !updateBy.some((updateModule) => updateModule.imei === module.imei))
      .map((module) => this._cloneConnectionModule.run(module));

    return [...connectionModules, ...notToBeUpdated];
  }
}
