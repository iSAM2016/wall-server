export declare class LoggerService {
    private readonly instance;
    constructor();
    info(message: string): void;
    error(message: string): void;
    private isTestEnv;
    private isProductionEnv;
}
