export class TcpInterfaceMessage {
  public static onDisconnection = "onDisconnection";
  public static onConnection = "onConnection";
  public static onData = "onData";

  public static acknowledge = "acknowledge";

  private readonly _type: string;
  private readonly _socketId: string;
  private readonly _data: string;
  private readonly _trackingId?: string;

  constructor(
    type: string,
    socketId: string,
    data: string,
    trackingId?: string,
  ) {
    this._type = type;
    this._socketId = socketId;
    this._data = data;
    this._trackingId = trackingId;
  }

  get type(): string {
    return this._type;
  }

  get socketId(): string {
    return this._socketId;
  }

  get data(): string {
    return this._data;
  }

  get trackingId(): string | undefined {
    return this._trackingId;
  }
}
