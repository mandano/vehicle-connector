import { Unknown } from "../../../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { SimpleUpdate} from "../../SimpleUpdate.ts";

export interface CreateUnknownInterface {
  run(paket: SimpleUpdate): Unknown | undefined;
}
