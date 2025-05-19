import amqplib from "amqplib";

const port = process.env.RABBITMQ_PORT || "5672";
const user = process.env.RABBITMQ_USER || "user";
const password = process.env.RABBITMQ_PASSWORD || "password";
const host = process.env.RABBITMQ_HOST || "localhost";
const timeout = process.env.RABBITMQ_UP_TIMEOUT
  ? parseInt(process.env.RABBITMQ_UP_TIMEOUT)
  : 30000;

const url = `amqp://${user}:${password}@${host}:${port}`;

console.log(`Waiting for ${url}`);

async function waitForRabbitMq(url: string, timeout: number): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const connection = await amqplib.connect(url);
      await connection.close();
      console.log("RabbitMQ ready.");
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw new Error("RabbitMQ Timeout.");
}

waitForRabbitMq(url, timeout)
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
