import * as log4js from 'log4js';
export declare class Logger {
    private options;
    private loggerCacheMap;
    private baseLoggerConfig;
    constructor(options: any);
    getLogger: (loggerType: string, loggerConfig: log4js.Configuration) => log4js.Logger;
    getExpressLogger(): log4js.Logger;
    info: (...arg: any[]) => void;
    warn: (...arg: any[]) => void;
    error: (...arg: any[]) => void;
    getLogger4Command: (commandName?: string) => log4js.Logger;
    getStackInfoString: () => string;
}
