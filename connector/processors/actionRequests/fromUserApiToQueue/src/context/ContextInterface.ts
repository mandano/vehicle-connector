import CreateMessageLineInterface
  from "../../../../../../modules/protocols/common/src/connector/toVehicle/actions/lock/CreateMessageLineInterface.ts";
import LoggerInterface from "../../../../../common/src/logger/LoggerInterface.ts";
import RabbitMqConnection from "../../../../../common/src/adapters/queue/rabbitMq/RabbitMqConnection.ts";

interface ContextInterface {
  get logger(): LoggerInterface;
  get rabbitMq(): RabbitMqConnection;
  get createMessageLine(): CreateMessageLineInterface;
}

export default ContextInterface;
