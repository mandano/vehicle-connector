import { Address } from "../vehicles/position/Address.ts";
import { Coordinate } from "../vehicles/position/Coordinate.ts";

/**
 * https://nominatim.org/release-docs/develop/api/Overview/
 */
export class OpenStreetMap {
  public async geocode(address: Address): Promise<Coordinate | undefined> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${address.street} ${address.number}, ${address.postCode}, ${address.country_code}`)}`;
    const response = await fetch(url);

    if (response.status !== 200) {
      return undefined;
    }

    const data = await response.json();
    if (data.length === 0) {
      return undefined;
    }

    return new Coordinate(parseFloat(data[0].lat), parseFloat(data[0].lon));
  }

  public async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<Address | undefined> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    const response = await fetch(url);

    if (response.status !== 200) {
      return undefined;
    }

    const data = await response.json();
    if (!data.address) {
      return undefined;
    }

    return new Address(
      data.address.road,
      data.address.postcode,
      data.address.country_code,
      data.address.house_number ?? undefined,
    );
  }

  public async snapToStreet(
    latitude: number,
    longitude: number,
  ): Promise<Coordinate | undefined> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    const response = await fetch(url);

    if (response.status !== 200) {
      return undefined;
    }

    const data = await response.json();
    if (!data.address) {
      return undefined;
    }

    return new Coordinate(parseFloat(data.lat), parseFloat(data.lon));
  }

  public status(): boolean {
    return true;
  }
}
