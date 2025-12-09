import ConnectionModule from "../../../../../components/iot/network/ConnectionModule.ts";
import PartialConnectionModuleDto from "../../../../../components/iot/network/connectionModule/PartialConnectionModuleDto.ts";

export default class UpdateConnectionModuleResult {
  constructor(
    private readonly _new: ConnectionModule,
    private readonly _changes: PartialConnectionModuleDto | undefined,
  ) {}

  get new(): ConnectionModule {
    return this._new;
  }

  get changes(): PartialConnectionModuleDto | undefined {
    return this._changes;
  }
}
