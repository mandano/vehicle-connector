import ConnectionModuleDto from "./ConnectionModuleDto.ts";

export default class NetworkDto {
  constructor(public connectionModules: ConnectionModuleDto[] = []) {}
}
