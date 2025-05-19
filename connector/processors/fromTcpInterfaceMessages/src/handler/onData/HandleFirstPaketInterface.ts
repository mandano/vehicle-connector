export interface HandleFirstPaketInterface {
  run(messageLine: string, socketId: string): Promise<void>;
}
