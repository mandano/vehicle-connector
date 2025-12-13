import StateDtoChanges from "../../../../state/StateDtoChanges.ts";

import ConnectionStates from "./ConnectionStates.ts";

export default class PartialConnectionStateDto {
  constructor(public readonly state?: StateDtoChanges<ConnectionStates>) {}
}
