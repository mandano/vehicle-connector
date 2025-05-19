import { ContainsLockInterface } from "./ContainsLockInterface.ts";

export default class ContainsLockCheck {
  public static run(model: unknown): model is ContainsLockInterface {
    return (
      typeof Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(model),
        "lock",
      )?.get === "function" &&
      (model as ContainsLockInterface).lock !== undefined
    );
  }
}
