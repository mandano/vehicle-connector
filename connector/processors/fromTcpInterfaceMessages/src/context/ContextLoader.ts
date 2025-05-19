import dotenv from "dotenv";

import RabbitMqConfig from "../../../../common/src/adapters/queue/rabbitMq/Config.ts";

import Context from "./Context.ts";

class ContextLoader {
  public public(): Context {
    dotenv.config();

    const rabbitMqPort = process.env.RABBITMQ_PORT
      ? parseInt(process.env.RABBITMQ_PORT)
      : 5672;
    const rabbitMqHost = process.env.RABBITMQ_HOST || "localhost";

    const rabbitMqConfig = new RabbitMqConfig(rabbitMqPort, rabbitMqHost);

    return new Context(rabbitMqConfig);
  }
}

export default ContextLoader;
