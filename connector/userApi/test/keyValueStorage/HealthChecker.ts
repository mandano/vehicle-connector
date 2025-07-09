import BaseHealthChecker from "../BaseHealthChecker.ts";

export default class HealthChecker extends BaseHealthChecker {
  protected readonly _serviceName: string = 'KeyValueStorage';
  protected readonly _subUrl = "/api/v1/health/keyValueStorage";

  constructor(baseUrl: string) {
    super(baseUrl);
  }
}
