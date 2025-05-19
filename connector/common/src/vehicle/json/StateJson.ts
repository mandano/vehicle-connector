export class StateJson<T> {
  public state: T;
  public originatedAt: string | undefined;
  public updatedAt?: Date;
  public createdAt: Date;

  constructor(
    state: T,
    originatedAt: string | undefined = undefined,
    updatedAt: Date | undefined,
    createdAt: Date,
  ) {
    this.state = state;
    this.originatedAt = originatedAt;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
