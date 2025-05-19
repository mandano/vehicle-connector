import { ValidationOrderInterface } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/ValidationOrderInterface.ts";
import {
  IMEI,
  LATITUDE,
  LONGITUDE,
  PAKET_TYPE,
  PROTOCOL,
  PROTOCOL_VERSION,
  TIME,
} from "../../attributeNames.ts";

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
    ];
  }
}
