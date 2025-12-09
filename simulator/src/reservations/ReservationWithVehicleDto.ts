import RouteDto from "./RouteDto.ts";

export default class ReservationWithVehicleDto {
  constructor(
    public readonly id: number,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly route: RouteDto,
    public readonly vehicleId: number,
    public readonly imei?: string
  ) {}
}
