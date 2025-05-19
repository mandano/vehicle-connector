import { SimpleUpdate as UpdateSimpleScooter0_1 } from "./connector/0_1/pakets/simpleUpdate/SimpleUpdate.ts";
import { SimpleUpdate as UpdateSimpleScooter0_2 } from "./connector/0_2/pakets/simpleUpdate/SimpleUpdate.ts";
import { Lock } from "./connector/0_1/pakets/lock/Lock.ts";

export type paketTypes = UpdateSimpleScooter0_1 | UpdateSimpleScooter0_2 | Lock;
export type Actions = Lock;
