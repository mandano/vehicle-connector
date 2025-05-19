import HealthChecker from "../../../connector/userApi/test/HealthChecker.ts";

const userApiHost = process.env.USER_API_HOST || "localhost";
const userApiPort = process.env.USER_API_PORT || "3000";
const timeout = process.env.USER_API_RABBIT_MQ_TIMEOUT ? parseInt(process.env.USER_API_RABBIT_MQ_TIMEOUT) : 20000;

const url = `http://${userApiHost}:${userApiPort}`;

console.log(`Waiting for ${url}`);

async function waitForRabbitMq(url: string, timeout: number): Promise<void> {
  const healthChecker = new HealthChecker(url);

  const healthy = await healthChecker.waitFor(timeout);

  if (healthy) {
    console.log("RabbitMQ is healthy.");
    return;
  }
  throw new Error(`RabbitMQ is not healthy after ${timeout}ms`);
}

waitForRabbitMq(url, timeout)
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
