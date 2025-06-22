export default class Hashable<T> {
  constructor(
    private readonly _hash: string,
    private readonly _value: T,
  ) {}

  get hash(): string {
    return this._hash;
  }

  get value(): T {
    return this._value;
  }
}
