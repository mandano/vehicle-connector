export default class HealthChecker {
  private static readonly SUB_URL = "/api/v1/health/queue";

  constructor(private _baseUrl: string) {}

  public async waitFor(timeoutInMilliseconds: number): Promise<boolean> {
    if (timeoutInMilliseconds < 0) {
      return false;
    }

    let approxElapsedTime = 0;
    console.log(`Waiting for service at ${this._baseUrl}...`);
    while (approxElapsedTime < timeoutInMilliseconds) {
      const healthy = await this.isHealthy();

      if (healthy === true) {
        return true;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      approxElapsedTime += 1000;
    }
    return false;
  }

  private async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${this._baseUrl}${HealthChecker.SUB_URL}`);
      if (!response.ok) {
        return false;
      }
      // const data = await response.json();
      return true;
    } catch (error: unknown) {
      console.error(
        "Error fetching data:",
        error instanceof Error ? error.message : error,
      );
      return false;
    }
  }
}
