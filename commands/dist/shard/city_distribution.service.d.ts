import { BaseService } from './serviceBase';
export declare class CityDistributionService extends BaseService {
    private readonly cityDistributionRepository;
    insertCityDistributionRecord(cityDistributeJson: any, projectId: any, createTimeAt: any): Promise<any>;
    updateCityDistributionRecord(id: any, projectId: any, createTimeAt: any, cityDistributeJson: any): Promise<boolean>;
}
