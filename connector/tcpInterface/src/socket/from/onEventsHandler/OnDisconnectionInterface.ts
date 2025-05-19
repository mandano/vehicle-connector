export interface OnDisconnectionInterface {
  run(socketId: string): Promise<void>;
}
