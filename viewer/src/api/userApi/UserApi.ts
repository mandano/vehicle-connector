import FetchResource from "../FetchResource";
import Vehicle from "../../types/vehicles/Vehicle";

export default class UserApi {
  constructor(
    private _apiUrl: string,
    private _fetchResource: FetchResource,
  ) {}

  public async getVehicles(): Promise<Vehicle[]> {
    let vehicles: Vehicle[] | undefined;

    try {
      vehicles = await this._fetchResource.run<Vehicle[]>(`${this._apiUrl}/vehicles/map`);
    } catch (error) {
      console.error(error);
      return [];
    }

    if (vehicles === undefined) {
      return [];
    }

    return vehicles;
  }
}
