import { Lock } from "./Lock.ts";

export interface ContainsLockInterface {
  get lock(): Lock;
}
