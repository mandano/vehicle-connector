import { ContainsOdometerInterface } from "./ContainsOdometerInterface.ts";

export default class ContainsOdometer {
  public static run(
    model: unknown,
  ): model is ContainsOdometerInterface {
    return (
      typeof Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(model),
        "odometer",
      )?.get === "function" &&
      (model as ContainsOdometerInterface).odometer !== undefined
    );
  }
}
