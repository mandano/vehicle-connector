export default class OrphanedSocket {
  constructor(
    private _id: string,
    private _ip: string,
    private _applicationName: string,
    private _createdAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get ip(): string {
    return this._ip;
  }

  get applicationName(): string {
    return this._applicationName;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}