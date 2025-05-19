import { ContainsNetworkInterface } from "./ContainsNetworkInterface.ts";

export default class ContainsNetwork {
  private static propertyName = "network";

  public static run(obj: unknown): obj is ContainsNetworkInterface {
    return (
      Object.prototype.hasOwnProperty.call(obj, ContainsNetwork.propertyName) ||
      typeof Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(obj),
        ContainsNetwork.propertyName,
      )?.get === "function"
    );
  }
}
