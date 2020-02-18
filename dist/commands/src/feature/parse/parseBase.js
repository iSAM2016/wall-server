"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const moment = require("moment");
const config_1 = require("../../config");
const core_1 = require("../../core");
const commandsBase_1 = require("../commandsBase");
const readLine = require('lei-stream').readLine;
class ParseBase extends commandsBase_1.default {
    constructor() {
        super(...arguments);
        this.readLog = async (startAtMoment, endAtMoment, legalRecord, readLogSaveToCache) => {
            let startAt = startAtMoment.unix();
            let endAt = endAtMoment.unix();
            let self = this;
            for (let currentAt = startAt; currentAt <= endAt; currentAt = currentAt + 60) {
                let currentAtMoment = moment.unix(currentAt);
                let absoluteLogUri = core_1.getAbsoluteLogUriByType(currentAt, core_1.LOG_TYPE_JSON);
                self.log(`开始处理${currentAtMoment.format(config_1.COMMAND_ARGUMENT_BY_MINUTE)}的记录, log文件地址 => ${absoluteLogUri}`);
                if (fs.existsSync(absoluteLogUri) === false) {
                    self.log(`log文件不存在, 自动跳过 => ${absoluteLogUri}`);
                    continue;
                }
                await new Promise((resolve, reject) => {
                    let onDataReceive = async (data, next) => {
                        if (legalRecord.call(self, data)) {
                            if (readLogSaveToCache.call(self, data)) {
                                next();
                            }
                            else {
                                next();
                            }
                        }
                        else {
                            self.log(`log 日志格式不正确=>` + data);
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
                                self.log('解析文件错误' + error.message);
                            }
                        },
                    }).go(onDataReceive, onReadFinish);
                });
                self.log('处理完毕');
            }
            this.log('全部数据处理完毕, 准备存入数据库中');
        };
    }
    reportProcess(processRecordCount, successSaveCount, totalRecordCount, tableName = '') {
        let insertTable = '';
        if (tableName) {
            insertTable = `, 入库${tableName}`;
        }
        if (processRecordCount % 100 === 0) {
            this.log(`当前已处理${processRecordCount}/${totalRecordCount}条记录${insertTable}, 已成功${successSaveCount}条`);
        }
    }
}
exports.default = ParseBase;
