import ParseBase from '../paseBase';
import { Repository } from 'typeorm';
import { TRUvRecord } from '@entity';
export declare class UvService extends ParseBase {
    private readonly uvRepository;
    constructor(uvRepository: Repository<TRUvRecord>);
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
    getExistUuidSetInHour: (projectId: any, visitAt: any) => Promise<Set<unknown>>;
    replaceUvRecord: (projectId: any, uuid: any, visitAt: any, country: any, province: any, city: any) => Promise<boolean>;
}
