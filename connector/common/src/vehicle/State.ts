export class State<T> {
  private _state: T;
  private _originatedAt: Date | undefined;
  private _updatedAt?: Date;
  private readonly _createdAt: Date;

  public static isState(obj: unknown): obj is State<unknown> {
    return (
      (obj as State<unknown>).state !== undefined &&
      (obj as State<unknown>).state !== null &&
      "updatedAt" in (obj as State<unknown>) &&
      "originatedAt" in (obj as State<unknown>) &&
      "createdAt" in (obj as State<unknown>)
    );
  }

  constructor(
    state: T,
    originatedAt: Date | undefined = undefined,
    updatedAt: Date | undefined = undefined,
    createdAt: Date | undefined = undefined,
  ) {
    this._state = state;
    this._originatedAt = originatedAt;
    this._updatedAt = updatedAt;
    this._createdAt = createdAt ?? new Date();
  }

  get state(): T {
    return this._state;
  }

  set state(state: T) {
    this._state = state;
    this._updatedAt = new Date();
  }

  get originatedAt(): Date | undefined {
    return this._originatedAt;
  }

  set originatedAt(originatedAt: Date | undefined) {
    this._originatedAt = originatedAt;
    this._updatedAt = new Date();
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}

export default State;
