import Unknown from "../../../../models/Unknown.ts";
import UpdateBatteries from "../../components/energy/batteries/UpdateBatteries.ts";
import UpdateIoT from "../../components/ioT/UpdateIoT.ts";
import UpdateBatteriesResult from "../../components/energy/batteries/UpdateBatteriesResult.ts";
import UpdateIotResult from "../../components/ioT/UpdateIotResult.ts";
import UnknownChanges from "../../../../models/unknown/UnknownChanges.ts";

import UpdateUnknownResult from "./UpdateUnknownResult.ts";

export default class UpdateUnknown {
  constructor(
    private _updateBatteries: UpdateBatteries,
    private _updateIoT: UpdateIoT,
  ) {}

  public run(toBeUpdated: Unknown, updateBy: Unknown): UpdateUnknownResult {
    const updateBatteriesResult = this.batteries(toBeUpdated, updateBy);
    const updateIotResult = this.iot(toBeUpdated, updateBy);

    const unknown = new Unknown(updateBatteriesResult.new, updateIotResult.new);

    return new UpdateUnknownResult(
      unknown,
      new UnknownChanges(
        updateBatteriesResult.changes,
        updateIotResult.changes,
      ),
    );
  }

  private batteries(
    toBeUpdated: Unknown,
    updateBy: Unknown,
  ): UpdateBatteriesResult {
    return this._updateBatteries.run(toBeUpdated.batteries, updateBy.batteries);
  }

  private iot(toBeUpdated: Unknown, updateBy: Unknown): UpdateIotResult {
    return this._updateIoT.run(toBeUpdated.ioT, updateBy.ioT);
  }
}
