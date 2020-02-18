import CommandsBase from '../commandsBase';
declare class GenerateSQL extends CommandsBase {
    static get signature(): string;
    static get description(): string;
    execute(args: any, options: any): Promise<boolean>;
    handle(args: any, options: any): Promise<void>;
    log(message: any): Promise<void>;
}
export default GenerateSQL;
