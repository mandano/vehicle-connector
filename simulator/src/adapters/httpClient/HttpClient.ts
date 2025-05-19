import { LoggerInterface } from "../../../../connector/common/src/logger/LoggerInterface.ts";

class HttpClient {
  private readonly baseURL: string;
  private _logger: LoggerInterface;

  constructor(baseURL: string, logger: LoggerInterface) {
    this.baseURL = baseURL;
    this._logger = logger;
  }

  private async request(url: string, options: RequestInit): Promise<object | undefined> {
    const urlStr = `${this.baseURL}${url}`;

    const curlStr = this.fetchToCurl(urlStr, options);
    this._logger.debug(`Send HTTP request: ${curlStr}`, HttpClient.name);

    try {
      const response = await fetch(urlStr, options);

      if (!response.ok) {
        this._logger.error(`HTTP error! status: ${response.status} ${urlStr}`, HttpClient.name);
      }
      return response.json();
    } catch (error) {
      this._logger.error(`Request error: ${error}`, HttpClient.name);
      return undefined;
    }
  }

  public async get(url: string): Promise<object | undefined> {
    try {
      return await this.request(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      this._logger.error(`Get: ${error}`, HttpClient.name);

      return undefined;
    }
  }

  public async post(url: string, data: unknown): Promise<object | undefined> {
    try {
      return await this.request(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      this._logger.error(`Post: ${error}`, HttpClient.name);

      return undefined;
    }
  }

  public async put(url: string, data: unknown): Promise<object | undefined> {
    try {
      return await this.request(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      this._logger.error(`Put: ${error}`, HttpClient.name);

      return undefined;
    }
  }

  private fetchToCurl(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const headers = options.headers ? Object.entries(options.headers).map(([key, value]) => `-H "${key}: ${value}"`).join(' ') : '';
    const body = options.body ? `-d '${options.body}'` : '';
    return `curl -X ${method} ${headers} ${body} "${url}"`;
  }
}

export default HttpClient;
