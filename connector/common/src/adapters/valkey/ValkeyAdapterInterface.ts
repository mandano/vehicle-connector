export interface ValkeyAdapterInterface {
  get(key: string): Promise<unknown | undefined>;
  set(key: string, value: unknown): Promise<boolean>;
  del(key: string): Promise<boolean>;
  scan(pattern: string): Promise<string[]>;
  multiSet(
    keyValues: {
      key: string;
      value: unknown;
    }[],
  ): Promise<boolean>;
}

export default ValkeyAdapterInterface;
