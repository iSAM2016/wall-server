declare class ParseBase {
    private readonly loggers;
    reportProcess(processRecordCount: any, successSaveCount: any, totalRecordCount: any, tableName?: string): void;
    readLog: (startAtMoment: any, endAtMoment: any, legalRecord: any, readLogSaveToCache: any) => Promise<void>;
}
export default ParseBase;
