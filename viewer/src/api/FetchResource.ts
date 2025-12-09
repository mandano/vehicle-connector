// TODO: add logging
export default class FetchResource {
  public async run<T>(url: string): Promise<T|undefined> {
    let response: Response;

    try {
      response = await fetch(url);
    } catch (error) {
      console.error(error);
      return undefined;
    }

    if (!response.ok) {
      return undefined;
    }

    let responseContent: T|undefined;

    try {
      responseContent = await response.json() as T;
    } catch (error) {
      console.error(error);
      return undefined;
    }

    return responseContent;
  }
}