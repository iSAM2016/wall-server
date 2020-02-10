import { Command } from '@adonisjs/ace';
import { Alert, Logger, ConfigService } from '../core';
declare abstract class CommandsBase extends Command {
    logger: Logger;
    alert: Alert;
    config: ConfigService;
    constructor();
    log(...arg: any[]): Promise<void>;
}
export default CommandsBase;
