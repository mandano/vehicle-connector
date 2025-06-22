import State from "../../../State.ts";

export default class ConnectionState {
  public static readonly CONNECTED = "connected";
  public static readonly DISCONNECTED = "disconnected";

  constructor(
    private _state: State<
      typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
    >,
  ) {}

  get state(): State<
    typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
  > {
    return this._state;
  }

  set state(
    state: State<
      typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
    >,
  ) {
    this._state = state;
  }
}
