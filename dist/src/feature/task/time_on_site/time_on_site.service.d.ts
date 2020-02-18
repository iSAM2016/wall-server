import ParseBase from '../paseBase';
import { Repository } from 'typeorm';
import { TRDurationDistribution, TRCityDistribution, TRUniqueView } from '@entity';
export declare class TimeOnSiteService extends ParseBase {
    private readonly durationDistributionRepository;
    private readonly cityDistributionRepository;
    private readonly uniqueViewRepository;
    constructor(durationDistributionRepository: Repository<TRDurationDistribution>, cityDistributionRepository: Repository<TRCityDistribution>, uniqueViewRepository: Repository<TRUniqueView>);
    private readonly logger;
    private projectMap;
    private endAtMoment;
    private startAtMoment;
    handle(): Promise<void>;
    readLogSaveToCache(record: any): boolean;
    isLegalRecord(record: any): boolean;
    getRecordCountInProjectMap(): number;
    saveTODB(): Promise<{
        totalRecordCount: number;
        processRecordCount: number;
        successSaveCount: number;
    }>;
    checkSaveCount(totalUv: any, oldRecordList: any, projectId: any, countAtTime: any, cityDistribute: any, totalStayMs: any): Promise<boolean>;
    updateCityDistribution(id: any, data: any, cityDistribute: any, cityDistributeIdInDb: any): Promise<boolean>;
    insertData(cityDistribute: any, data: any, projectId: any, updateAt: any): Promise<boolean>;
    replaceUvRecord: (projectId: any, countAtTime: any, countType: any) => Promise<TRDurationDistribution[]>;
    getTotalUv(projectId: any, countAtTime: any, countType: any): Promise<any>;
    updateDuration: (id: any, data: any) => Promise<any>;
    insertDuration(data: any): Promise<any>;
    updateCityDistributionRecord(id: any, cityDistributeJson: any): Promise<boolean>;
    insertCityDistributionRecord(cityDistributeJson: any, projectId: any, createTimeAt: any): Promise<any>;
}
