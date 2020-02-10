import CommandsBase from '../commandsBase';
import { ProjectService } from '../../shard';
declare class NginxParse extends CommandsBase {
    projectService: ProjectService;
    constructor();
    static get signature(): string;
    static get description(): string;
    handle(...arg: any[]): Promise<boolean>;
    parseLogCreateAt(data: any): number;
    getProjectMap(): Promise<void>;
    isTestLog(content: any): any;
    parseLog(data: any, projectMap: any): Promise<any>;
    getWriteStreamClientByType(nowAt: any, logType?: string): any;
    autoCloseOldStream(isCloseAll?: boolean): boolean;
}
export default NginxParse;
