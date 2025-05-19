import { Logger } from "../../../connector/common/src/logger/Logger.ts";
import { LogLevels } from "../../../connector/common/src/logger/LogLevels.ts";
import ProtocolsContextPublic from "../../../modules/protocols/common/src/_Context.ts";
import TheSimpleProtocol from "../../../modules/protocols/theSimpleProtocol/src/_Context.ts";

import PublicContext from "./Context.ts";
import ContextInterface from "./ContextInterface.ts";

class ContextLoader {
  public public(): ContextInterface {
    const logger = new Logger(LogLevels.DEBUG_LEVEL);

    return new PublicContext(
      new ProtocolsContextPublic(new TheSimpleProtocol(logger)),
    );
  }
}

export default ContextLoader;
