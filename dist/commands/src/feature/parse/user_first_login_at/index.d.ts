import * as moment from 'moment';
import ParseBase from '../parseBase';
import { ParseInterface } from '../../../utils';
import { UserFirstLoginAtService } from './user_first_login_at.service';
declare class UserFirstLoginAt extends ParseBase implements ParseInterface {
    constructor();
    projectMap: Map<any, any>;
    startAtMoment: moment.Moment;
    endAtMoment: moment.Moment;
    userFirstLoginAtService: UserFirstLoginAtService;
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
export default UserFirstLoginAt;
