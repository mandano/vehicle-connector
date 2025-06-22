import { SendActionRequestInterface } from "../../../../src/vehicle/model/actions/SendActionRequestInterface.ts";
import { ActionState } from "../../../../src/vehicle/model/actions/ActionState.ts";

export class FakeSendActionRequest implements SendActionRequestInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(actionRequest: ActionState): Promise<boolean | undefined> {
    return Promise.resolve(undefined);
  }
}

export default FakeSendActionRequest;
