import ConnectionState from "../../../../../../components/iot/network/ConnectionState.ts";
import PartialConnectionStateDto from "../../../../../../components/iot/network/connectionModule/connectionState/PartialConnectionStateDto.ts";

export default class UpdateConnectionStateResult {
  constructor(
    private readonly _new: ConnectionState | undefined,
    private readonly _changes: PartialConnectionStateDto | undefined,
  ) {}

  get new(): ConnectionState | undefined {
    return this._new;
  }

  get changes(): PartialConnectionStateDto | undefined {
    return this._changes;
  }
}
