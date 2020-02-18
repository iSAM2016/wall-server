import { BaseService } from './serviceBase';
export declare class BehaviorDistributionService extends BaseService {
    private readonly behaviorDistributionRepository;
    replaceRecord(projectId: any, code: any, countAtTime: any, countType: any): Promise<any>;
    updateBehavior: (id: any, data: any) => Promise<any>;
    insertDuration(data: any): Promise<any>;
}
