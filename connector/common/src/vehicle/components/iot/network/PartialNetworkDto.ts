import PartialConnectionModuleDto from "./connectionModule/PartialConnectionModuleDto.ts";

export default class PartialNetworkDto {
  constructor(public connectionModules?: PartialConnectionModuleDto[]) {}
}
