import { ActionState } from "../ActionState.ts";

export class ActionStateToJson {
  public static run(actionRequest: ActionState): string {
    return JSON.stringify({
      id: actionRequest.id,
      state: actionRequest.state,
      createdAt: actionRequest.createdAt.toISOString(),
      vehicleId: actionRequest.vehicleId,
      type: actionRequest.type,
    });
  }
}
