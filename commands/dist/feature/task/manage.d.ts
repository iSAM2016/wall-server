import CommandsBase from '../commandsBase';
import { CommandsModuleInterface } from '../../utils';
declare class TaskManger extends CommandsBase implements CommandsModuleInterface {
    constructor();
    static get signature(): string;
    static get description(): string;
    handle(arg: any, options: any): Promise<void>;
    claoseOtherTaskManger(): Promise<void>;
    getOtherTaskMangerPidList(): Promise<any[]>;
    registerTaskRepeatPer1Minute(): void;
    registerTaskRepeatPer10Minute(): void;
    registerTaskRepeatPer1Hour(): Promise<void>;
    execCommand(commandName: any, args?: any[]): void;
    dispatchParseCommand(commandName: any, startAtStr: any, endAtStr: any): Promise<void>;
}
export default TaskManger;
