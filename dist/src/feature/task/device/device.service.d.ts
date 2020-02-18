import ParseBase from '../paseBase';
import { Repository } from 'typeorm';
import { TRSystemCollection } from '@entity';
export declare class DeviceService extends ParseBase {
    private readonly deviceRepository;
    constructor(deviceRepository: Repository<TRSystemCollection>);
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
    getOldList(projectId: any, visitAtMonth: any, uuid: any): Promise<TRSystemCollection[]>;
    updataDevice(datas: any, id: any): Promise<any>;
    createDevice(datas: any): Promise<any>;
}
