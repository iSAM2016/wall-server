import * as moment from 'moment';
import ParseBase from '../parseBase';
import { ParseInterface } from '../../../utils';
import { BehaviorDistributionService, CityDistributionService } from '../../../shard';
declare class MenuClick extends ParseBase implements ParseInterface {
    constructor();
    projectMap: Map<any, any>;
    startAtMoment: moment.Moment;
    endAtMoment: moment.Moment;
    behaviorDistributionService: BehaviorDistributionService;
    cityDistributionService: CityDistributionService;
    static get signature(): string;
    static get description(): string;
    handle(...arg: any[]): Promise<void>;
    readLogSaveToCache(record: any): boolean;
    isLegalRecord(record: any): boolean;
    getRecordCountInProjectMap(): number;
    saveTODB(): Promise<{
        totalRecordCount: number;
        processRecordCount: number;
        successSaveCount: number;
    }>;
    checkSaveCount(url: any, name: any, code: any, projectId: any, totalCount: any, countAtTime: any, oldRecordList: any, cityDistribute: any): Promise<boolean>;
    updateCityDistribution(id: any, data: any, projectId: any, createTimeInDb: any, cityDistribute: any, cityDistributeIdInDb: any): Promise<boolean>;
    insertCityDistributionRecord(cityDistribute: any, data: any, projectId: any, updateAt: any): Promise<boolean>;
}
export default MenuClick;
