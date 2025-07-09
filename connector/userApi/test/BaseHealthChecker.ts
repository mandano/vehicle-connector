import HealthCheckerInterface from "./HealthCheckerInterface.ts";

export default abstract class BaseHealthChecker implements HealthCheckerInterface {
  protected readonly abstract _subUrl: string;
  protected readonly abstract _serviceName: string;

  protected constructor(private _baseUrl: string) {}

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
      const response = await fetch(`${this._baseUrl}${this._subUrl}`);
      if (!response.ok) {
        console.log(`Service ${this._serviceName} is not healthy, status: ${response.status}`)

        return false;
      }
      // const data = await response.json();
      console.log(`Service ${this._serviceName} is healthy.`);
      return true;
    } catch (error: unknown) {
      console.error(
        `Service ${this._serviceName}, error fetching data:`,
        error instanceof Error ? error.message : error,
      );
      return false;
    }
  }

  get serviceName(): string {
    return this._serviceName;
  }

  get url(): string {
    return `${this._baseUrl}${this._subUrl}`;
  }
}
