import ParseBase from '../paseBase';
import { Repository } from 'typeorm';
import { TRBehaviorDistribution, TRCityDistribution } from '@entity';
export declare class MenuClickService extends ParseBase {
    private readonly behaviorDistributionRepository;
    private readonly cityDistributionRepository;
    constructor(behaviorDistributionRepository: Repository<TRBehaviorDistribution>, cityDistributionRepository: Repository<TRCityDistribution>);
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
    checkSaveCount(url: any, name: any, code: any, projectId: any, totalCount: any, countAtTime: any, oldRecordList: any, cityDistribute: any): Promise<boolean>;
    updateCityDistribution(id: any, data: any, cityDistribute: any, cityDistributeIdInDb: any): Promise<boolean>;
    insertData(cityDistribute: any, data: any, projectId: any, updateAt: any): Promise<boolean>;
    replaceRecord(projectId: any, code: any, countAtTime: any, countType: any): Promise<TRBehaviorDistribution[]>;
    updateBehavior: (id: any, data: any) => Promise<any>;
    insertDuration(data: any): Promise<any>;
    updateCityDistributionRecord(id: any, cityDistributeJson: any): Promise<boolean>;
    insertCityDistributionRecord(cityDistributeJson: any, projectId: any, createTimeAt: any): Promise<any>;
}
