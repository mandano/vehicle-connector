export interface SocketInterface {
    write(data: string): boolean;
    onEnd(onEnd: () => void): void;
    onTimeout(onTimeout: () => void): void;
    onData(onData: (data: Buffer) => void): void;
    get remoteAddress(): string | undefined;
}