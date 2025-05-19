import { Unknown } from "./Unknown.ts";
import { LockableScooter } from "./LockableScooter.ts";

export type types =
  | Unknown
  | LockableScooter;

export type typeNames =
  | typeof Unknown.name
  | typeof LockableScooter.name;

export const names = [
  Unknown.name,
  LockableScooter.name,
];
