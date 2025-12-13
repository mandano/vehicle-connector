import ConnectionState from "../../ConnectionState.ts";

type ConnectionStates = typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED;

export default ConnectionStates;