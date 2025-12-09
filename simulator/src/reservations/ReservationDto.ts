import RouteDto from "./RouteDto.ts";

export default class ReservationDto {
  constructor(
    public readonly id: number,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly route: RouteDto,
  ) {}
}
