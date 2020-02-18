import * as moment from 'moment';
import ParseBase from '../parseBase';
import { ParseInterface } from '../../../utils';
import { UniqueViewService, CityDistributionService } from '../../../shard';
import { DurationDistributionService } from './duration_distribution.service';
declare class TimeOnSiteByHour extends ParseBase implements ParseInterface {
    projectMap: Map<any, any>;
    startAtMoment: moment.Moment;
    endAtMoment: moment.Moment;
    uniqueViewService: UniqueViewService;
    durationDistributionService: DurationDistributionService;
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
    checkSaveCount(totalUv: any, oldRecordList: any, projectId: any, countAtTime: any, cityDistribute: any, totalStayMs: any): Promise<boolean>;
    updateCityDistribution(id: any, data: any, projectId: any, createTimeInDb: any, cityDistribute: any, cityDistributeIdInDb: any): Promise<boolean>;
    insertCityDistributionRecord(cityDistribute: any, data: any, projectId: any, updateAt: any): Promise<boolean>;
    getRecordCountInProjectMap(): number;
}
export default TimeOnSiteByHour;
