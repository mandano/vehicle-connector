import { SendToServer } from "../SendToServer.ts";
import { Vehicle } from "../../../../../connector/common/src/vehicle/Vehicle.ts";
import CreateMessageLinesInterface
  from "../../../../../modules/protocols/common/src/simulator/toConnector/update/CreateMessageLinesInterface.ts";

export class SendUpdate {
  constructor(
    private _sendToServer: SendToServer,
    private _createMessageLines: CreateMessageLinesInterface,
  ) {}

  public async run(vehicle: Vehicle): Promise<void> {
    const messageLines = this._createMessageLines.run(vehicle);

    if (messageLines === undefined) {
      return undefined;
    }

    for (const messageLine of messageLines) {
      await this._sendToServer.run(messageLine);
    }
  }
}
