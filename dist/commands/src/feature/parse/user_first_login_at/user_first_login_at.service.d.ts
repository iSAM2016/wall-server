import { BaseService } from '../../../shard';
export declare class UserFirstLoginAtService extends BaseService {
    private readonly userFirstLoginAtRepository;
    filterExistUcidSetInDb(projectId: any, allUcidList: any): Promise<Set<unknown>>;
    getOldRecordList(projectId: any, ucid: any): Promise<any>;
    updateUserFirstLoginAt: (id: any, data: any, projectId: any) => Promise<any>;
    insertUserFirstLoginAt(data: any, projectId: any): Promise<any>;
}
