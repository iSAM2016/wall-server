"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const date_format_1 = require("../../config/date_format");
exports.StartPase = (target, propertyName, descriptor) => {
    let oldmethod = descriptor.value;
    descriptor.value = function (...arg) {
        this.log(this.constructor.name + 'start');
        let { startAtYmdHi, endAtYmdHi } = arg[0];
        this.startAtMoment = moment(startAtYmdHi, date_format_1.COMMAND_ARGUMENT_BY_MINUTE);
        this.endAtMoment = moment(endAtYmdHi, date_format_1.COMMAND_ARGUMENT_BY_MINUTE);
        let isSuccess = true;
        if (moment.isMoment(this.startAtMoment) === false ||
            this.startAtMoment.isValid() === false) {
            let message = `startAtYmdHi参数不正确 => ${startAtYmdHi}`;
            this.warn(message);
            this.alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), message);
            isSuccess = false;
        }
        if (moment.isMoment(this.endAtMoment) === false ||
            this.endAtMoment.isValid() === false) {
            let message = `endAtYmdHi参数不正确 =>${endAtYmdHi}`;
            this.warn(message);
            this.alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), message);
            isSuccess = false;
        }
        if (this.startAtMoment.unix() > this.endAtMoment.unix()) {
            let message = `结束时间小于开始时间 :  ${startAtYmdHi} => ${this.startAtMoment.unix()} endAtYmdHi =>  ${this.endAtMoment.unix()}`;
            this.warn(message);
            this.alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), message);
            isSuccess = false;
        }
        if (!isSuccess) {
            let message = `${this.constructor.name}参数不正确, 自动退出`;
            this.warn(message);
            this.alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), message);
            this.log(this.constructor.name + 'Parse:UV  finish');
            return false;
        }
        this.log(`开始分析${this.startAtMoment.format(date_format_1.COMMAND_ARGUMENT_BY_MINUTE) +
            ':00'}~${this.endAtMoment.format(date_format_1.COMMAND_ARGUMENT_BY_MINUTE) +
            ':59'}范围内的记录`);
        oldmethod.apply(this, arg);
    };
};
exports.EndParse = function (target, propetyKey, descriptor) {
    let oldMethod = descriptor.value;
    descriptor.value = function (...arg) {
        return __awaiter(this, void 0, void 0, function* () {
            let { totalRecordCount, processRecordCount, successSaveCount, } = yield oldMethod.apply(this, arg);
            this.log(`${this.startAtMoment.format(date_format_1.COMMAND_ARGUMENT_BY_MINUTE) +
                ':00'}~${this.endAtMoment.format(date_format_1.COMMAND_ARGUMENT_BY_MINUTE) +
                ':59'}范围内日志录入完毕, 共记录数据${processRecordCount}/${totalRecordCount}条, 入库成功${successSaveCount}条`);
            this.log('数据库正常关闭');
            this.log(this.constructor.name + 'Parse:UV  finish');
        });
    };
};
