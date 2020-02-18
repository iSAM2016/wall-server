"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const moment = require("moment");
const common_1 = require("@nestjs/common");
const config_service_1 = require("../../core/configure/config.service");
const app_1 = require("../../../config/app");
const _utils_1 = require("../../utils");
const readLine = require('lei-stream').readLine;
class ParseBase {
    constructor() {
        this.loggers = new common_1.Logger(ParseBase.name);
        this.readLog = async (startAtMoment, endAtMoment, legalRecord, readLogSaveToCache) => {
            let startAt = startAtMoment.unix();
            let endAt = endAtMoment.unix();
            for (let currentAt = startAt; currentAt <= endAt; currentAt = currentAt + 60) {
                let currentAtMoment = moment.unix(currentAt);
                let absoluteLogUri = '';
                if (config_service_1.ConfigService.isDevelopment) {
                    absoluteLogUri = `${app_1.default.absoluteLogPath}/nginx/json/month_202002/day_07/07/21.log`;
                }
                else {
                    absoluteLogUri = _utils_1.getAbsoluteLogUriByType(currentAt, _utils_1.LOG_TYPE_JSON);
                }
                this.loggers.log(`开始处理${currentAtMoment.format(_utils_1.COMMAND_ARGUMENT_BY_MINUTE)}的记录, log文件地址 => ${absoluteLogUri}`);
                if (fs.existsSync(absoluteLogUri) === false) {
                    this.loggers.log(`log文件不存在, 自动跳过 => ${absoluteLogUri}`);
                    continue;
                }
                await new Promise((resolve, reject) => {
                    let onDataReceive = async (data, next) => {
                        if (legalRecord.call(this, data)) {
                            if (readLogSaveToCache.call(this, data)) {
                                next();
                            }
                            else {
                                next();
                            }
                        }
                        else {
                            this.loggers.log(`log 日志格式不正确=>` + data);
                        }
                    };
                    let onReadFinish = () => {
                        resolve();
                    };
                    readLine(fs.createReadStream(absoluteLogUri), {
                        newline: '\n',
                        autoNext: false,
                        encoding: function (data) {
                            try {
                                return JSON.parse(data);
                            }
                            catch (error) {
                                this.loggers.log('解析文件错误' + error.message);
                            }
                        },
                    }).go(onDataReceive, onReadFinish);
                });
                this.loggers.log('处理完毕');
            }
            this.loggers.log('全部数据处理完毕, 准备存入数据库中');
        };
    }
    reportProcess(processRecordCount, successSaveCount, totalRecordCount, tableName = '') {
        let insertTable = '';
        if (tableName) {
            insertTable = `, 入库${tableName}`;
        }
        if (processRecordCount % 100 === 0) {
            this.loggers.log(`当前已处理${processRecordCount}/${totalRecordCount}条记录${insertTable}, 已成功${successSaveCount}条`);
        }
    }
}
exports.default = ParseBase;
