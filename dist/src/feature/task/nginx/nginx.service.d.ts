import { TRProject } from '@entity';
import { Repository } from 'typeorm';
export declare class NginxService {
    private readonly projectRepository;
    constructor(projectRepository: Repository<TRProject>);
    private readonly logger;
    projectMap: {};
    logCounter: number;
    legalLogCounter: number;
    registerTaskRepeatPer1Minute(): void;
    nginxSaveLog(): Promise<boolean>;
    onDataIn: (data: any, next: any) => Promise<boolean>;
    parseLogCreateAt(data: any): number;
    parseLog(data: any, projectMap: any): Promise<any>;
    getWriteStreamClientByType(nowAt: any, logType?: string): any;
    autoCloseOldStream(isCloseAll?: boolean): boolean;
    getList(): Promise<{}>;
}
