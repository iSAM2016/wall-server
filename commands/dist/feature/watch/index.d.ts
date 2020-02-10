import CommandsBase from '../commandsBase';
import { CommandsModuleInterface } from '../../utils';
import { WatchService } from './watch.service';
import { RedisClient } from '../../core';
declare class WatchAlarm extends CommandsBase implements CommandsModuleInterface {
    watchService: WatchService;
    redisClient: RedisClient;
    currentQueryCounter: number;
    constructor();
    static get signature(): string;
    static get description(): string;
    handle(args: any, options: any): Promise<void>;
    autoAlarm(projectId: any, errorName: any, timeRange: any, maxErrorCount: any, alarmInterval: any, redisKey: any, note: any, configId: any): Promise<void>;
}
export default WatchAlarm;
