import LockState from "../../components/lock/LockState.ts";

import {
  ActionStateTypes,
  TypeSupportedActionStateTypes,
} from "./ActionStateTypes.ts";

// TODO: use transfer action object??
export class ActionState {
  private readonly _state:
    | typeof LockState.LOCKED
    | typeof LockState.UNLOCKED;
  private readonly _id: string;
  private readonly _vehicleId: number;
  private readonly _type: TypeSupportedActionStateTypes;
  private readonly _createdAt: Date;

  public static isActionState(data: unknown): data is ActionState {
    return (
      typeof data === "object" &&
      data !== undefined &&
      data !== null &&
      "state" in data &&
      (typeof data.state === "number" ||
        data.state === LockState.LOCKED ||
        data.state === LockState.UNLOCKED) &&
      "id" in data &&
      typeof data.id === "string" &&
      "vehicleId" in data &&
      typeof data.vehicleId === "number" &&
      "type" in data &&
      typeof data.type === "string" &&
      ActionStateTypes.SUPPORTED_TYPES.includes(data.type) &&
      "createdAt" in data &&
      typeof data.createdAt === "string"
    );
  }

  constructor(
    state: typeof LockState.LOCKED | typeof LockState.UNLOCKED,
    id: string,
    createdAt: Date,
    vehicleId: number,
    type: TypeSupportedActionStateTypes,
  ) {
    this._state = state;
    this._id = id;
    this._createdAt = createdAt;
    this._vehicleId = vehicleId;
    this._type = type;
  }

  get state(): typeof LockState.LOCKED | typeof LockState.UNLOCKED {
    return this._state;
  }

  get id(): string {
    return this._id;
  }

  get vehicleId(): number {
    return this._vehicleId;
  }

  get type(): TypeSupportedActionStateTypes {
    return this._type;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
