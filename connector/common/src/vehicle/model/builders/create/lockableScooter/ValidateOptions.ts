import { Lock } from "../../../../components/lock/Lock.ts";

import Options from "./Options.ts";

export default class ValidateOptions {
  public run(options: unknown): options is Options {
    const mandatoryAttributesValid =
      options !== null &&
      options !== undefined &&
      typeof options === "object" &&
      "imei" in options &&
      "protocol" in options &&
      "protocolVersion" in options &&
      typeof options.imei === "string" &&
      typeof options.protocol === "string" &&
      typeof options.protocolVersion === "string";

    if (!mandatoryAttributesValid) {
      return false;
    }

    if ("coordinate" in options) {
      const coordinateValid =
        options.coordinate === undefined ||
        options.coordinate === null ||
        (typeof options.coordinate === "object" &&
          "latitude" in options.coordinate &&
          "longitude" in options.coordinate &&
          typeof options.coordinate.latitude === "number" &&
          typeof options.coordinate.longitude === "number");

      if (!coordinateValid) {
        return false;
      }
    }

    if ("lock" in options) {
      const lockValid =
        options.lock === undefined ||
        options.lock === null ||
        options.lock instanceof Lock;

      if (!lockValid) {
        return false;
      }
    }

    if ("initWithDefaultValues" in options) {
      const initWithDefaultValuesValid =
        options.initWithDefaultValues === undefined ||
        options.initWithDefaultValues === null ||
        typeof options.initWithDefaultValues === "boolean";

      if (!initWithDefaultValuesValid) {
        return false;
      }
    }

    return true;
  }
}
