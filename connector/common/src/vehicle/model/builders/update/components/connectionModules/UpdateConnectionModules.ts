import ConnectionModule from "../../../../../components/iot/network/ConnectionModule.ts";
import CloneConnectionModule from "../../../../../components/iot/network/CloneConnectionModule.ts";
import PartialConnectionModuleDto from "../../../../../components/iot/network/connectionModule/PartialConnectionModuleDto.ts";
import UpdateConnectionModule from "../connectionModule/UpdateConnectionModule.ts";
import UpdateConnectionModuleResult from "../connectionModule/UpdateConnectionModuleResult.ts";
import ConnectionModuleToChanges from "../connectionModule/ConnectionModuleToChanges.ts";

import UpdateConnectionModulesResult from "./UpdateConnectionModulesResult.ts";

export default class UpdateConnectionModules {
  constructor(
    private readonly _updateConnectionModule: UpdateConnectionModule,
    private readonly _cloneConnectionModule: CloneConnectionModule,
    private readonly _connectionModuleToChanges: ConnectionModuleToChanges,
  ) {}

  public run(
    toBeUpdated: ConnectionModule[],
    updateBy: ConnectionModule[],
  ): UpdateConnectionModulesResult {
    const connectionModules: ConnectionModule[] = [];
    const changes: PartialConnectionModuleDto[] = [];

    for (const updateByConnectionModule of updateBy) {
      const updateConnectionModuleResult = this.updateModule(
        toBeUpdated,
        updateByConnectionModule,
      );

      connectionModules.push(updateConnectionModuleResult.new);

      if (updateConnectionModuleResult.changes !== undefined) {
        changes.push(updateConnectionModuleResult.changes);
      }
    }

    const notToBeUpdated = toBeUpdated
      .filter(
        (module) =>
          !updateBy.some((updateModule) => updateModule.imei === module.imei),
      )
      .map((module) => this._cloneConnectionModule.run(module));

    return new UpdateConnectionModulesResult(
      [...connectionModules, ...notToBeUpdated],
      changes,
    );
  }

  private updateModule(
    toBeUpdated: ConnectionModule[],
    updateByConnectionModule: ConnectionModule,
  ): UpdateConnectionModuleResult {
    const toBeUpdatedConnectionModuleIdx = toBeUpdated.findIndex(
      (toBeUpdatedConnectionModule) =>
        toBeUpdatedConnectionModule.imei === updateByConnectionModule.imei,
    );

    if (toBeUpdatedConnectionModuleIdx === -1) {
      const clonedConnectionModule = this._cloneConnectionModule.run(
        updateByConnectionModule,
      );

      const connectionModuleChanges = this._connectionModuleToChanges.run(clonedConnectionModule);

      return new UpdateConnectionModuleResult(
        clonedConnectionModule,
        connectionModuleChanges,
      );
    }

    return this._updateConnectionModule.run(
      toBeUpdated[toBeUpdatedConnectionModuleIdx],
      updateByConnectionModule,
    );
  }
}
