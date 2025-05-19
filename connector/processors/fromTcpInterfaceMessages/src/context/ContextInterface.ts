import CreateByMessageLineContextInterface from "../../../../../modules/protocols/common/src/connector/fromVehicle/models/CreateByMessageLineContextInterface.ts"
import CreateMessageLineInterface from "../../../../../modules/protocols/common/src/connector/fromVehicle/CreateInterface.ts";
import CreateByProtocolAndVersionInterface
  from "../../../../../modules/protocols/common/src/connector/fromVehicle/CreateByProtocolAndVersionInterface.ts";
import LoggerInterface from "../../../../common/src/logger/LoggerInterface.ts";
import RabbitMqConnection from "../../../../common/src/adapters/queue/rabbitMq/RabbitMqConnection.ts";

interface ContextInterface {
  get logger(): LoggerInterface;
  get rabbitMq(): RabbitMqConnection;
  get createModelByMessageLineContext(): CreateByMessageLineContextInterface;
  get createMessageLineContext(): CreateMessageLineInterface;
  get createMessageLineContextByProtocolAndVersion(): CreateByProtocolAndVersionInterface;
}

export default ContextInterface;
