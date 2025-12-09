import UnknownChanges from "../../../models/unknown/UnknownChanges.ts";

import LockableScooterChanges from "./lockableScooter/LockableScooterChanges.ts";

export type Changes = UnknownChanges | LockableScooterChanges;

export default Changes;
