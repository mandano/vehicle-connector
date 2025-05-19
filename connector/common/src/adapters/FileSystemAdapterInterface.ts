export interface FileSystemAdapterInterface {
    readData(path: string): unknown[];
    writeData(data: unknown, path: string): boolean;
}
