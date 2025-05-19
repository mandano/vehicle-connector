export interface MessageLineSplitterInterface {
  run(messageLine: string): string[] | undefined;
}
