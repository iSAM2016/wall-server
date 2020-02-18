import * as moment from 'moment';
import ParseBase from '../parseBase';
import { UVService } from './uv.service';
import { ParseInterface, DBResult } from '../../../utils';
declare class ParseUV extends ParseBase implements ParseInterface {
    constructor();
    projectMap: Map<any, any>;
    startAtMoment: moment.Moment;
    endAtMoment: moment.Moment;
    uvService: UVService;
    static get signature(): string;
    static get description(): string;
    handle(...arg: any[]): Promise<void>;
    readLogSaveToCache(record: any): boolean;
    isLegalRecord(): boolean;
    getRecordCountInProjectMap(): number;
    saveTODB(): Promise<DBResult>;
}
export default ParseUV;
