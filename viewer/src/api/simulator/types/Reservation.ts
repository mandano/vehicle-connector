import Route from "./Route";

type Reservation = {
  id: number;
  startTime: string; // ISO 8601 date string
  endTime: string;   // ISO 8601 date string
  route: Route;
  vehicleId: number;
  imei: string;
};

export default Reservation;
