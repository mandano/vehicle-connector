import {ActionState} from "../ActionState.ts";

export interface ActionStateFromJsonInterface {
  run(json: string): ActionState | undefined;
}

export default ActionStateFromJsonInterface;
