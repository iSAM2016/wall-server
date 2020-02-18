export * from './nginx';
export * from './dataFormat';
declare function getFlattenCityRecordListInDistribution(distribution: any): any[];
declare const getLocalIpList: () => any[];
export declare const sleep: (ms: any) => Promise<unknown>;
declare function ip2Locate(ip: any): Promise<{
    country: string;
    province: string;
    city: string;
}>;
export { ip2Locate, getLocalIpList, getFlattenCityRecordListInDistribution, };
