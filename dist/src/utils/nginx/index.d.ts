declare const LOG_TYPE_RAW = "raw";
declare const LOG_TYPE_JSON = "json";
declare const LOG_TYPE_TEST = "test";
declare function getAbsoluteBasePathByType(logType?: string): string;
declare function getAbsoluteLogUriByType(logAt: any, logType?: string): string;
declare function getMonthDirName(logAt: any): string;
export { getAbsoluteLogUriByType, getAbsoluteBasePathByType, getMonthDirName, LOG_TYPE_RAW, LOG_TYPE_JSON, LOG_TYPE_TEST, };
