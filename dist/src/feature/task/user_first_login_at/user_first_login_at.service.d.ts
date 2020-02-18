import ParseBase from '../paseBase';
import { Repository } from 'typeorm';
import { TRUserFirstLoginAt } from '@entity';
export declare class UserFirstLoginAtService extends ParseBase {
    private readonly userFirstLoginAtRepository;
    constructor(userFirstLoginAtRepository: Repository<TRUserFirstLoginAt>);
    private readonly logger;
    private projectMap;
    private endAtMoment;
    private startAtMoment;
    handle(): Promise<void>;
    readLogSaveToCache(record: any): boolean;
    isLegalRecord(): boolean;
    getRecordCountInProjectMap(): number;
    saveTODB(): Promise<{
        totalRecordCount: number;
        processRecordCount: number;
        successSaveCount: number;
    }>;
    filterExistUcidSetInDb(projectId: any, allUcidList: any): Promise<Set<unknown>>;
    getOldRecordList(projectId: any, ucid: any): Promise<TRUserFirstLoginAt[]>;
    updateUserFirstLoginAt: (id: any, data: any) => Promise<any>;
    insertUserFirstLoginAt(data: any): Promise<any>;
}
