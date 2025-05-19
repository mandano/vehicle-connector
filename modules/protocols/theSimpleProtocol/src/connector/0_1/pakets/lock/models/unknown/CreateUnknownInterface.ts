import { Unknown } from "../../../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { Lock } from "../../Lock.ts";

export interface CreateUnknownInterface {
  run(paket: Lock): Unknown | undefined;
}
