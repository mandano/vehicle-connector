export interface ExchangeInterface {
  init(): Promise<boolean>;
  publish(message: string): Promise<boolean | undefined>;
}
