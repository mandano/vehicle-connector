export interface LoggerInterface {
    log(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    info(message: string, context?: string): void;
    warn(message: string, context?: string): void;
    error(message: string, context?: string): void;
}

export default LoggerInterface;
