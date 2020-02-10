import { BaseService } from '../../../shard';
export declare class DeviceService extends BaseService {
    private readonly deviceRepository;
    getOldList(projectId: any, visitAtMonth: any, uuid: any): Promise<any>;
    updataDevice(datas: any, projectId: any, id: any): Promise<any>;
    createDevice(datas: any, projectId: any): Promise<any>;
}
