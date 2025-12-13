import Reservations from "../../types/reservations/Reservations";
import FetchResource from "../FetchResource";

import ReservationsFromApi from "./types/Reservations";

export default class SimulatorApi {
  constructor(
    private _apiUrl: string,
    private _fetchResource: FetchResource,
  ) {}

  public async getReservations(): Promise<Reservations> {
    let reservationsFromApi: ReservationsFromApi | undefined = undefined;

    try {
      reservationsFromApi = await this._fetchResource.run<ReservationsFromApi>(
        `${this._apiUrl}/reservations`,
      );
    } catch (error) {
      console.error(error);
      return [];
    }

    if (!reservationsFromApi) {
      return [];
    }

    return reservationsFromApi.map((reservation) => {
      return {
        ...reservation,
        route: {
          ...reservation.route,
          waypoints: reservation.route.waypoints.map((waypoint) => [
            waypoint.lat,
            waypoint.lng,
          ]),
        },
      };
    });
  }
}
