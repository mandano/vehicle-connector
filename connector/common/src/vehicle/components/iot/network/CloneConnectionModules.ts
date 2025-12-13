import ConnectionModule from "./ConnectionModule.ts";
import CloneConnectionModule from "./CloneConnectionModule.ts";

export default class CloneConnectionModules {
  constructor(
    private readonly cloneConnectionModule: CloneConnectionModule,
  ) {}

  public run(connectionModules: ConnectionModule[]): ConnectionModule[] {
    const clonedConnectionModules: ConnectionModule[] = [];

    connectionModules.forEach((connectionModule) => {
      clonedConnectionModules.push(this.cloneConnectionModule.run(connectionModule));
    })

    return clonedConnectionModules;
  }
}
