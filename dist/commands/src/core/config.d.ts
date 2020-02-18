export declare class ConfigService {
    private static envConfig;
    private rootPath;
    constructor();
    private isFileExist;
    private validateInpt;
    static get(key: string, defaultValue?: ''): string | number;
    get(key: string, defaultVal?: any): string | number;
    static get isDevelopment(): boolean;
    get isDevelopment(): boolean;
    static get isProduction(): boolean;
    get isProduction(): boolean;
    static get isTest(): boolean;
    get isTest(): boolean;
    getEnv(): string;
}
export declare const getConfig: () => ConfigService;
