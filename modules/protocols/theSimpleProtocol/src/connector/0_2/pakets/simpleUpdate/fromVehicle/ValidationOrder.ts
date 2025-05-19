import { ValidationOrderInterface } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/ValidationOrderInterface.ts";
import {
  IMEI,
  LATITUDE,
  LONGITUDE,
  PAKET_TYPE,
  PROTOCOL,
  PROTOCOL_VERSION,
  TIME, TRACKING_ID,
} from "../../../../0_1/pakets/attributeNames.ts";
import {ENERGY, MILEAGE, SPEED} from "../attributeNames.ts";

export class ValidationOrder implements ValidationOrderInterface {
  public attributes(): string[] {
    return [
      PROTOCOL,
      PROTOCOL_VERSION,
      IMEI,
      PAKET_TYPE,
      TIME,
      LONGITUDE,
      TIME,
      LATITUDE,
      TIME,
      MILEAGE,
      TIME,
      ENERGY,
      TIME,
      SPEED,
      TIME,
      TRACKING_ID
    ];
  }
}
