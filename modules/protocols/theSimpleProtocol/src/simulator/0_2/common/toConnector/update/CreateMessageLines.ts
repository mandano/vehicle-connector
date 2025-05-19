import { Vehicle } from "../../../../../../../../../connector/common/src/vehicle/Vehicle.ts";
import { ToMessageLine as createMessageLineUpdateSimpleScooter } from "../../../pakets/simpleUpdate/ToMessageLine.ts";

export class CreateMessageLines {
  constructor(
    private _createMessageLineUpdateSimpleScooter: createMessageLineUpdateSimpleScooter,
  ) {}

  public run(vehicle: Vehicle): string[] | undefined {
    const updateSimpleScooter =
      this._createMessageLineUpdateSimpleScooter.run(vehicle);

    const messageLines: string[] = [];

    if (updateSimpleScooter !== undefined) {
      messageLines.push(updateSimpleScooter);
    }

    return messageLines;
  }
}

export default CreateMessageLines;
