export default interface HealthCheckerInterface {
  waitFor(timeoutInMilliseconds: number): Promise<boolean>;
  get serviceName(): string;
  get url(): string;
}