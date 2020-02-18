"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commandsBase_1 = require("./feature/commandsBase");
class CommandDemo extends commandsBase_1.default {
    constructor() {
        super(...arguments);
        this.projectMap = new Map();
    }
    static get signature() {
        return `
    Command:Demo

     {user:[必传]用户名}
     {name?:[可选]称谓}

     {--onlyFlag:[必传]flag,只有true/false两个值}
     {--logName=@value:[必传]日志文件名}
     {--isTest?=@value:[可选]是否处于测试环境}
     `;
    }
    static get description() {
        return '解析nginx日志, 分析pv';
    }
    async handle(args, options) {
        this.log('Command:Demo start');
        let { user, name } = args;
        let { onlyFlag, logName, isTest } = options;
        this.log('user =>', user);
        this.log(`CommandDemo, name=> ${name}`);
        this.log(`CommandDemo, onlyFlag=> ${onlyFlag}`);
        this.log(`CommandDemo, logName=> ${logName}`);
        this.log(`CommandDemo, isTest=> ${isTest}`);
        this.log('Command:Demo finish');
    }
    readLogSaveToCache() {
        return true;
    }
    isLegalRecord() {
        return true;
    }
    async saveTODB() {
        return {
            totalRecordCount: 1,
            processRecordCount: 2,
            successSaveCount: 2,
        };
    }
}
exports.default = CommandDemo;