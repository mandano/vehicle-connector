export class LogLevels {
    static readonly TRACE = 'trace';
    static readonly DEBUG = 'debug';
    static readonly INFO = 'info';
    static readonly WARN = 'warn';
    static readonly ERROR = 'error';

    static readonly TRACE_LEVEL = 0;
    static readonly DEBUG_LEVEL = 1;
    static readonly INFO_LEVEL = 2;
    static readonly WARN_LEVEL = 3;
    static readonly ERROR_LEVEL = 4;

    static readonly levels = [
        LogLevels.TRACE,
        LogLevels.DEBUG,
        LogLevels.INFO,
        LogLevels.WARN,
        LogLevels.ERROR
    ];

    static getLevel(level: string): number {
        let logLevel = LogLevels.levels.findIndex(element => element === level)
        if (logLevel === -1) {
            logLevel = LogLevels.ERROR_LEVEL;
        }

        return logLevel;
    }
}

export default LogLevels;

