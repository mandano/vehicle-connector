import { ActionState } from "./ActionState.ts";

export interface SendActionRequestInterface {
  run(actionRequest: ActionState): Promise<boolean | undefined>;
}

export default SendActionRequestInterface;
