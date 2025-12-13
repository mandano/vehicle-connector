export default class StateDtoChanges<T> {
  constructor(
    public state?: T,
    public originatedAt?: string | undefined,
    public createdAt?: string,
    public updatedAt?: string | undefined,
  ) {}
}
