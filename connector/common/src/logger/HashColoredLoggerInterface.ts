export interface HashColoredLoggerInterface {
    log(message: string, colorHash: string, context?: string): void;
    debug(message: string, colorHash: string, context?: string): void;
    info(message: string, colorHash: string, context?: string): void;
    warn(message: string, colorHash: string, context?: string): void;
    error(message: string, colorHash: string, context?: string): void;
}

export default HashColoredLoggerInterface;
