import { DotenvConfigOptions } from 'dotenv';
import moment = require('moment');
export interface CommandInterface {
    new (): CommandsModuleInterface;
    signature(): string;
    description(): string;
}
export interface CommandsModuleInterface {
    handle(args: any, options: any): Promise<any>;
}
export interface ParseInterface extends CommandsModuleInterface {
    startAtMoment: moment.Moment;
    endAtMoment: moment.Moment;
    projectMap: any;
    saveTODB(): Promise<DBResult>;
    readLogSaveToCache(record: any): boolean;
    isLegalRecord(recode: any): boolean;
}
export interface DBResult {
    totalRecordCount: number;
    processRecordCount: number;
    successSaveCount: number;
}
export interface EnvConfig {
    [key: string]: any;
}
export interface ConfigOptions extends Partial<DotenvConfigOptions> {
}
export interface ParseBaseInterface {
    isArgumentsLegal(args: any): any;
    parseLog(startAt: number, endAt: number): any;
}
