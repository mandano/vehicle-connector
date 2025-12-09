import ValkeyAdapterInterface from "../../../src/adapters/valkey/ValkeyAdapterInterface.ts";

export default class ValkeyAdapterFake implements ValkeyAdapterInterface {
  private store: Map<string, unknown> = new Map();
  private connected = true;

  async get(key: string): Promise<unknown | undefined> {
    return this.store.get(key);
  }

  async set(key: string, value: unknown): Promise<boolean> {
    this.store.set(key, value);
    return true;
  }

  async del(key: string): Promise<boolean> {
    const existed = this.store.delete(key);
    return existed;
  }

  async scan(pattern: string): Promise<string[]> {
    // very small glob implementation supporting '*' wildcard
    const regex = globToRegExp(pattern);
    const keys: string[] = [];
    for (const k of this.store.keys()) {
      if (regex.test(k)) keys.push(k);
    }
    return keys;
  }

  async multiSet(
    keyValues: { key: string; value: unknown }[],
  ): Promise<boolean> {
    for (const { key, value } of keyValues) {
      this.store.set(key, value);
    }
    return true;
  }

  async multiDel(keys: string[]): Promise<boolean> {
    let ok = true;
    for (const key of keys) {
      const res = this.store.delete(key);
      ok = ok && res;
    }
    return ok;
  }

  async isConnected(): Promise<boolean> {
    return this.connected;
  }

  // Helpers for tests to manipulate connection state and inspect store
  disconnect() {
    this.connected = false;
  }
  connect(): Promise<void> {
    this.connected = true;
    return new Promise((resolve) => setTimeout(resolve, 100));
  }
  clear() {
    this.store.clear();
  }

  close(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

// --- utils ---
function globToRegExp(glob: string): RegExp {
  // Escape regex special chars, then replace '*' with '.*'
  const escaped = glob.replace(/[.+^${}()|\[\\\\\]\\]/g, "\\$&");
  const regexStr = "^" + escaped.replace(/\\\*/g, ".*") + "$";
  return new RegExp(regexStr);
}
