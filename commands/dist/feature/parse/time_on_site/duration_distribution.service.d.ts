import { BaseService } from '../../../shard';
export declare class DurationDistributionService extends BaseService {
    private readonly durationDistributionRepository;
    replaceUvRecord: (projectId: any, countAtTime: any, countType: any) => Promise<any>;
    updateDuration: (id: any, data: any) => Promise<any>;
    insertDuration(data: any): Promise<any>;
}
