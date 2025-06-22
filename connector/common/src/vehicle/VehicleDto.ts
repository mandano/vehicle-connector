import type Dto from "./model/ModelDto.ts";

export default class VehicleDto {
  constructor(
    public id: number,
    public model: Dto,
    public createdAt: string,
  ) {}
}
