import ConnectionStates
  from "../../../../../components/iot/network/connectionModule/connectionState/ConnectionStates.ts";
import State from "../../../../../State.ts";

type ConnectionModuleChanges = {
  state?: Partial<State<ConnectionStates>>;
  detectedProtocolVersion?: Partial<State<string>>;
  setProtocolVersion?: Partial<State<string>>;
  detectedProtocol?: Partial<State<string>>;
  setProtocol?: Partial<State<string>>;
};

export default ConnectionModuleChanges;