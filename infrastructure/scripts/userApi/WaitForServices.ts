import HealthCheckerInterface from "userapi/test/HealthCheckerInterface.ts";

export default class WaitForServices {
  private readonly _healthCheckers: HealthCheckerInterface[];

  constructor(healthCheckers: HealthCheckerInterface[]) {
    this._healthCheckers = healthCheckers;
  }

  async run(timeout: number): Promise<boolean> {
    const healthPromises = this._healthCheckers.map((checker) =>
      checker.waitFor(timeout),
    );

    for (const healthChecker of this._healthCheckers) {
      console.log(`Waiting for service ${healthChecker.serviceName} on ${healthChecker.url}`);
    }

    const results: Awaited<boolean>[] = await Promise.all(healthPromises);

    const serviceResults = results.map((result, index) => ({
      serviceName: this._healthCheckers[index].serviceName,
      isHealthy: result,
    }));

    const allHealthy = results.every((result) => result === true);

    if (!allHealthy) {
      const unhealthyServices = serviceResults
        .filter((sr) => !sr.isHealthy)
        .map((sr) => sr.serviceName);

      console.log(`Error while waiting for services: ${unhealthyServices.join(", ")}`)

      return false;
    }

    console.log("All services are healthy.");
    return true;
  }
}
