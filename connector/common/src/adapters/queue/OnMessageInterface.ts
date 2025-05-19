export interface OnMessageInterface {
  run(message: string): Promise<void>;
}
