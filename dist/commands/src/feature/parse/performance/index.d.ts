import * as moment from 'moment';
import ParseBase from '../parseBase';
import { ParseInterface } from '../../../utils';
import { CityDistributionService } from '../../../shard';
import { PerformanceService } from './performance.service';
declare class Performance extends ParseBase implements ParseInterface {
    projectMap: Map<any, any>;
    startAtMoment: moment.Moment;
    endAtMoment: moment.Moment;
    performanceService: PerformanceService;
    cityDistributionService: CityDistributionService;
    static get signature(): string;
    static get description(): string;
    handle(...arg: any[]): Promise<void>;
    isLegalRecord(): boolean;
    readLogSaveToCache(record: any): boolean;
    saveTODB(): Promise<{
        totalRecordCount: number;
        processRecordCount: number;
        successSaveCount: number;
    }>;
    checkSaveCount(url: any, countAt: any, indicator: any, pv: any, projectId: any, countType: any, oldRecordList: any, cityDistribute: any, sumIndicatorValue: any): Promise<boolean>;
    updateCityDistribution(id: any, data: any, projectId: any, countAt: any, createTimeInDb: any, cityDistribute: any, cityDistributeIdInDb: any): Promise<boolean>;
    insertCityDistributionRecord(cityDistribute: any, data: any, projectId: any, updateAt: any): Promise<boolean>;
    getRecordCountInProjectMap(): number;
}
export default Performance;
