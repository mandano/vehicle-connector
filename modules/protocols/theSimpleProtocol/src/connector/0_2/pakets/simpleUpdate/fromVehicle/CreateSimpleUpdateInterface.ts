import SimpleUpdate from "../SimpleUpdate.ts";

export default interface CreateSimpleUpdateInterface {
  run(messageLine: string): SimpleUpdate | undefined;
}
