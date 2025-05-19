import { ContainsBatteriesInterface } from "../../components/iot/ContainsBatteriesInterface.ts";
import { ContainsSpeedometerInterface } from "../../components/speedometer/ContainsSpeedometerInterface.ts";

export class Model {
  public static containsEnergy(
    model: unknown,
  ): model is ContainsBatteriesInterface {
    return (
      typeof Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(model),
        "energy",
      )?.get === "function"
    );
  }

  public static containsBatteries(
    model: unknown,
  ): model is ContainsBatteriesInterface {
    return (
      typeof Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(model),
        "batteries",
      )?.get === "function"
    );
  }

  public static containsSpeedometer(
    model: unknown,
  ): model is ContainsSpeedometerInterface {
    return (
      typeof Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(model),
        "speedometer",
      )?.get === "function" &&
      (model as ContainsSpeedometerInterface).speedometer !== undefined
    );
  }
}
