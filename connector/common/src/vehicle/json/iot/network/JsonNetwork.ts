import { JsonConnectionModule } from "./JsonConnectionModule.ts";

export class JsonNetwork {
  public connectionModules: JsonConnectionModule[] = [];

  constructor(connectionModules: JsonConnectionModule[]) {
    this.connectionModules = connectionModules;
  }
}
