import { StateJson } from "../StateJson.ts";

export interface EnergyComponentInterface {
  get level(): StateJson<number>;
}
