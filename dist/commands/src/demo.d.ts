import Base from './feature/commandsBase';
import { CommandsModuleInterface, DBResult } from './utils';
import moment = require('moment');
declare class CommandDemo extends Base implements CommandsModuleInterface {
    startAtMoment: moment.Moment;
    endAtMoment: moment.Moment;
    projectMap: Map<any, any>;
    static get signature(): string;
    static get description(): string;
    handle(args: any, options: any): Promise<void>;
    readLogSaveToCache(): boolean;
    isLegalRecord(): boolean;
    saveTODB(): Promise<DBResult>;
}
export default CommandDemo;
