import { ActionState } from "../ActionState.ts";
import { LoggerInterface } from "../../../../logger/LoggerInterface.ts";

import { ActionStateFromJsonInterface } from "./ActionStateFromJsonInterface.ts";

export class ActionStateFromJson implements ActionStateFromJsonInterface {
  private _logger: LoggerInterface;

  constructor(logger: LoggerInterface) {
    this._logger = logger;
  }

  public run(json: string): ActionState | undefined {
    let data: unknown;

    try {
      data = JSON.parse(json);
    } catch (e) {
      this._logger.error(
        `Failed to parse JSON: ${e}`,
        ActionStateFromJson.name,
      );

      return undefined;
    }

    if (!ActionState.isActionState(data)) {
      this._logger.error(
        `Invalid ActionState: ${json}`,
        ActionStateFromJson.name,
      );

      return undefined;
    }

    return new ActionState(
      data.state,
      data.id,
      new Date(data.createdAt),
      data.vehicleId,
      data.type,
    );
  }
}

export default ActionStateFromJson;
