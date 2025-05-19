import {
  MessageLineSplitterInterface
} from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/MessageLineSplitterInterface.ts";

/**
 * exemplary payload
 *
 * T_S_P;0_2;17-808331-937761-2;UPDATE_SIMPLE_SCOOTER;2025-03-26T16:16:56.839Z;lat=-1.3393,latOriginatedAt=2025-03-26T16:16:56.839Z,lng=-15.8821,lngOriginatedAt=2025-03-26T16:16:56.839Z,mileage=6112559627482277,mileageOriginatedAt=2025-03-26T16:16:56.839Z,energy=7009762207329423,energyOriginatedAt=2025-03-26T16:16:56.839Z,speed=6186214279081677,speedOriginatedAt=2025-03-26T16:16:56.839Z,trackingId=undefined
 * */
export class MessageLineSplitter implements MessageLineSplitterInterface {
  private _mainItemDelimiter: string = ";";
  private _vehicleInformationDelimiter: string = ",";
  private _mainItemCount = 6;
  private _vehicleInformationCount = 11;

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

      const value = vehicleInformationItemValues[1];

      vehicleInformationValues.push(value);
    }

    if (vehicleInformationValues.length !== this._vehicleInformationCount) {
      return undefined;
    }

    return [...mainItems.slice(0, -1), ...vehicleInformationValues];
  }
}
