import CoordinateDto from "../vehicles/position/CoordinateDto.ts";

export default class RouteDto {
  constructor(
    public readonly waypoints: CoordinateDto[],
    public readonly distance: number,
    public readonly duration: number,
    public readonly avgSpeed: number,
  ) {}
}
