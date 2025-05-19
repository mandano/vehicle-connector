import { MessageLineSplitterInterface } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/MessageLineSplitterInterface.ts";

export class MessageLineSplitter implements MessageLineSplitterInterface {
  private _mainItemDelimiter: string = ";";
  private _vehicleInformationDelimiter: string = ",";
  private _mainItemCount = 7;
  private _vehicleInformationCount = 2;

  public run(messageLine: string): string[] | undefined {
    const mainItems = messageLine
      .split(this._mainItemDelimiter)
      .map((item) => item.trim());

    if (mainItems.length !== this._mainItemCount) {
      return undefined;
    }

    const vehicleInformation = mainItems[5];

    const vehicleInformationItems = vehicleInformation
      .split(this._vehicleInformationDelimiter)
      .map((item) => item.trim());

    const vehicleInformationValues: string[] = [];

    for (const vehicleInformationItem of vehicleInformationItems) {
      const vehicleInformationItemValues = vehicleInformationItem.split("=");

      if (
        vehicleInformationItemValues.length !== 2
      ) {
        return undefined;
      }

      vehicleInformationValues.push(vehicleInformationItemValues[1]);
    }

    if (vehicleInformationValues.length !== this._vehicleInformationCount) {
      return undefined;
    }

    return [...mainItems.slice(0, -2), ...vehicleInformationValues, mainItems[6]];
  }
}
