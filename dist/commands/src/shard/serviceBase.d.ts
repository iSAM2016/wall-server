import { Logger } from '../core';
declare class BaseService {
    loggers: Logger;
    log(...arg: any[]): Promise<void>;
}
export { BaseService };
