import { BaseService } from './serviceBase';
export declare class UniqueViewService extends BaseService {
    private readonly uniqueViewRepository;
    getRecord(projectId: any, countAtTime: any, countType: any): Promise<any>;
    getTotalUv(projectId: any, countAtTime: any, countType: any): Promise<any>;
}
