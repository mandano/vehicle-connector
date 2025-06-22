import SpeedometerDto from "../../components/speedometer/SpeedometerDto.ts";
import OdometerDto from "../../components/odometer/OdometerDto.ts";
import LockStateDto from "../../components/lock/LockStateDto.ts";
import BatteriesDto from "../../components/energy/BatteriesDto.ts";
import IotDto from "../../components/iot/IotDto.ts";

export default class LockableScooterDto {
  constructor(
    public readonly lock?: LockStateDto,
    public readonly batteries?: BatteriesDto,
    public readonly ioT?: IotDto,
    public readonly speedometer?: SpeedometerDto,
    public readonly odometer?: OdometerDto,
  ) {}
}
