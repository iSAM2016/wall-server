import * as moment from 'moment';
import ParseBase from '../parseBase';
import { ParseInterface } from '../../../utils';
import { DataCleaning } from '../../../core';
import { DeviceService } from './device.service';
declare class ParseDevice extends ParseBase implements ParseInterface {
    constructor();
    projectMap: Map<any, any>;
    startAtMoment: moment.Moment;
    endAtMoment: moment.Moment;
    deviceService: DeviceService;
    dataCleaning: DataCleaning;
    static get signature(): string;
    static get description(): string;
    handle(...arg: any[]): Promise<void>;
    readLogSaveToCache(record: any): boolean;
    isLegalRecord(): boolean;
    getRecordCountInProjectMap(): number;
    saveTODB(): Promise<{
        totalRecordCount: number;
        processRecordCount: number;
        successSaveCount: number;
    }>;
}
export default ParseDevice;
