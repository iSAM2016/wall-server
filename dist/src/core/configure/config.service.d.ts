export declare class ConfigService {
    private options;
    private static envConfig;
    private rootPath;
    constructor(options: any);
    private isFileExist;
    private validateInpt;
    static get(key: string, defaultValue?: any): string | number;
    get(key: string, defaultVal?: any): string;
    getKeys(keys: string[]): any;
    getJson(key: string): {
        [prop: string]: any;
    };
    has(key: string): boolean;
    static get isDevelopment(): boolean;
    get isDevelopment(): boolean;
    static get isProduction(): boolean;
    get isProduction(): boolean;
}
