import { ContainsIotInterface } from "./ContainsIotInterface.ts";

export default class ContainsIot {
  public static run(obj: unknown): obj is ContainsIotInterface {
    return (
      Object.prototype.hasOwnProperty.call(obj, "ioT") ||
      typeof Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), "ioT")
        ?.get === "function"
    );
  }
}
