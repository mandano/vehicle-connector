import StateDtoChanges from "../../../state/StateDtoChanges.ts";
import type Imei from "../protocol/Imei.ts";

import PartialConnectionStateDto from "./connectionState/PartialConnectionStateDto.ts";

export default class PartialConnectionModuleDto {
  constructor(
    public imei: Imei,
    public state?: PartialConnectionStateDto,
    public detectedProtocolVersion?: StateDtoChanges<string>,
    public setProtocolVersion?: StateDtoChanges<string>,
    public detectedProtocol?: StateDtoChanges<string>,
    public setProtocol?: StateDtoChanges<string>,
  ) {}
}
