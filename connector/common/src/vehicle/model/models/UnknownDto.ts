import OdometerDto from "../../components/odometer/OdometerDto.ts";
import SpeedometerDto from "../../components/speedometer/SpeedometerDto.ts";
import LockStateDto from "../../components/lock/LockStateDto.ts";
import IotDto from "../../components/iot/IotDto.ts";
import BatteriesDto from "../../components/energy/BatteriesDto.ts";

export default class UnknownDto {
  constructor(
    public readonly batteries?: BatteriesDto,
    public readonly ioT?: IotDto,
    public readonly lock?: LockStateDto,
    public readonly speedometer?: SpeedometerDto,
    public readonly odometer?: OdometerDto,
  ) {}
}
