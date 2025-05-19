import Pakets from "../../common/src/Pakets.ts";

import { SimpleUpdate as UpdateSimpleScooter0_1 } from "./connector/0_1/pakets/simpleUpdate/SimpleUpdate.ts";
import { SimpleUpdate as UpdateSimpleScooter0_2 } from "./connector/0_2/pakets/simpleUpdate/SimpleUpdate.ts";
import { Lock } from "./connector/0_1/pakets/lock/Lock.ts";
import { paketTypes } from "./paketTypes.ts";

export default class IsProtocol {
  public static run(paket: Pakets): paket is paketTypes {
    return (
      paket instanceof UpdateSimpleScooter0_1 ||
      paket instanceof UpdateSimpleScooter0_2 ||
      paket instanceof Lock
    );
  }
}
