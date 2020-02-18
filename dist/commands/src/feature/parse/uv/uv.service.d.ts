import { BaseService } from '../../../shard';
export declare class UVService extends BaseService {
    private readonly uvRepository;
    getExistUuidSetInHour: (projectId: any, visitAt: any) => Promise<Set<unknown>>;
    replaceUvRecord: (projectId: any, uuid: any, visitAt: any, country: any, province: any, city: any) => Promise<boolean>;
}
