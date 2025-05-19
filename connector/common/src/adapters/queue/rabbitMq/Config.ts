export default class Config {
  private readonly _retry: boolean;

  constructor(
    private readonly _port?: number,
    private readonly _host?: string,
    private readonly _user?: string,
    private readonly _password?: string,
    _retry?: boolean,
  ) {
    this._port = _port || 5672;
    this._host = _host || "localhost";
    this._user = _user || "user";
    this._password = _password || "password";
    this._retry = _retry || true;
  }

  public url(): string {
    return `amqp://${this._user}:${this._password}@${this._host}:${this._port}`;
  }

  get retry(): boolean {
    return this._retry;
  }
}
