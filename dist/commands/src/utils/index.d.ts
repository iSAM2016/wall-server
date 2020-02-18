export * from './nginx';
export * from './annotation';
export * from './interface';
declare function getFlattenCityRecordListInDistribution(distribution: any): any[];
declare const getLocalIpList: () => any[];
export declare const sleep: (ms: any) => Promise<unknown>;
declare let http: import("axios").AxiosInstance;
declare function ip2Locate(ip: any): Promise<{
    country: string;
    province: string;
    city: string;
}>;
export { http, ip2Locate, getLocalIpList, getFlattenCityRecordListInDistribution, };
