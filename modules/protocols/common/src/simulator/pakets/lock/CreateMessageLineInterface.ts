import {TransferLock} from "../../../../../../../connector/common/src/vehicle/actions/TransferLock.ts";

interface CreateMessageLineInterface {
  run(lock: TransferLock): string | undefined;
}

export default CreateMessageLineInterface;
