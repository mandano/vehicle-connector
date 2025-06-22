import Vehicle from "../types/Vehicle";

const API_URL = "/api/v1";

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  try {
    return await fetchResource<Vehicle[]>(`${API_URL}/vehicles/map`);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function fetchResource<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    return [] as T;
  }

  return await response.json() as T;
}