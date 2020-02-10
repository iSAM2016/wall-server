import { BaseService } from '../../../shard';
export declare class PerformanceService extends BaseService {
    private readonly performanceRepository;
    getRecordList(projectId: any, url: any, indicator: any, countAt: any, countType?: string): Promise<any>;
    updatePerformance: (id: any, data: any, projectId: any, countAt: any) => Promise<any>;
    insertPerformance(data: any, projectId: any, countAt: any): Promise<any>;
}
