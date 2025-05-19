import { MessageLineSplitterInterface } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/MessageLineSplitterInterface.ts";

/**
 * TODO: add logging!
 * exemplary payload
 *
 * T_S_P;0_1;13456789;UPDATE_SIMPLE_SCOOTER;2021-01-01T00:00:00.000Z;lat=12.4567,lat_timestamp=2021-01-01T00:00:00.000Z,lng=12.4567,lng_timestamp=2021-01-01T00:00:00.000Z
 */
export class MessageLineSplitter implements MessageLineSplitterInterface {
  private _mainItemDelimiter: string = ";";
  private _vehicleInformationDelimiter: string = ",";
  private _mainItemCount = 6;
  private _vehicleInformationCount = 4;

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

      if (vehicleInformationItemValues.length !== 2) {
        return undefined;
      }

      vehicleInformationValues.push(vehicleInformationItemValues[1]);
    }

    if (vehicleInformationValues.length !== this._vehicleInformationCount) {
      return undefined;
    }

    return [...mainItems.slice(0, -1), ...vehicleInformationValues];
  }
}
