import BaseHealthChecker from "../BaseHealthChecker.ts";

export default class HealthChecker extends BaseHealthChecker {
  protected readonly _serviceName: string = 'Queue';
  protected readonly _subUrl = "/api/v1/health/queue";

  constructor(baseUrl: string) {
    super(baseUrl);
  }
}
