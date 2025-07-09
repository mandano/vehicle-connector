import HealthCheckerKeyValueStorage from "../../../connector/userApi/test/keyValueStorage/HealthChecker.ts";
import HealthCheckerQueue from "../../../connector/userApi/test/queue/HealthChecker.ts";

import WaitForServices from "./WaitForServices.ts";

const userApiHost = process.env.USER_API_HOST || "localhost";
const userApiPort = process.env.USER_API_PORT || "3000";
const timeout = process.env.USER_API_RABBIT_MQ_TIMEOUT
  ? parseInt(process.env.USER_API_RABBIT_MQ_TIMEOUT)
  : 20000;

const url = `http://${userApiHost}:${userApiPort}`;

async function wait(url: string, timeout: number): Promise<void> {
  const waitForServices = new WaitForServices([
    new HealthCheckerKeyValueStorage(url),
    new HealthCheckerQueue(url),
  ]);

  const healthy = await waitForServices.run(timeout);

  if (healthy) {
    return;
  }
  throw new Error(`Service/s not healthy after ${timeout}ms`);
}

wait(url, timeout)
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
