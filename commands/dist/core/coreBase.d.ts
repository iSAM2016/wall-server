import { Alert, Logger } from '../core';
import { ConfigService } from '../core';
declare abstract class CoreBase {
    logger: Logger;
    alert: Alert;
    config: ConfigService;
    constructor();
    log(...arg: any[]): Promise<void>;
}
export default CoreBase;
