import Vehicle from "../../../../../../../../../connector/common/src/vehicle/Vehicle.ts";
import CreateMessageLinesSimpleUpdate from "../../../pakets/simpleUpdate/models/CreateMessageLine.ts";

export class ToMessageLines {
  constructor(
    private _createMessageLinesSimpleUpdate: CreateMessageLinesSimpleUpdate,
  ) {}

  public run(vehicle: Vehicle): string[] | undefined {
    const messageLine =
      this._createMessageLinesSimpleUpdate.run(vehicle);

    const messageLines: string[] = [];

    if (messageLine !== undefined) {
      messageLines.push(messageLine);
    }

    return messageLines;
  }
}

export default ToMessageLines;
