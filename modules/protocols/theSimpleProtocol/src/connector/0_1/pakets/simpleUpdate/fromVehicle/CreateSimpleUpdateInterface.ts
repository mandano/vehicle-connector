import SimpleUpdate from "../SimpleUpdate.ts";

export interface CreateSimpleUpdateInterface {
  run(messageLine: string): SimpleUpdate | undefined;
}

export default CreateSimpleUpdateInterface;
