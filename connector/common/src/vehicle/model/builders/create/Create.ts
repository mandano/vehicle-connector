import { LockableScooter } from "../../models/LockableScooter.ts";

import { CreateLockableScooter } from "./lockableScooter/CreateLockableScooter.ts";
import ValidateOptions from "./lockableScooter/ValidateOptions.ts";

type ModelNames = typeof LockableScooter.name;
type CreatableModels = LockableScooter;

export default class Create {
  public static MODEL_TYPES = [LockableScooter.name];
  private _errors: string[] = [];

  constructor(
    private _lockableScooter: CreateLockableScooter,
    private _lockableScooterValidOptions: ValidateOptions,
  ) {}

  public run(
    modelName: ModelNames,
    data: unknown,
  ): CreatableModels | undefined {
    switch (modelName) {
      case LockableScooter.name:
        if (!this._lockableScooterValidOptions.run(data)) {
          this._errors.push(
            `Invalid model attributes`,
          );
          return undefined;
        }

        return this._lockableScooter.run(data);
      default:
        this._errors.push(
          `Model ${modelName} is not supported. Supported models are: ${Create.MODEL_TYPES.join(
            ", ",
          )}`,
        );
        return undefined;
    }
  }

  public get errors(): string[] {
    return this._errors;
  }
}
