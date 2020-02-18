"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const moment = require("moment");
const shell = require("shelljs");
const schedule = require("node-schedule");
const utils_1 = require("../../utils");
const commandsBase_1 = require("../commandsBase");
const config_1 = require("../../config");
class TaskManger extends commandsBase_1.default {
    constructor() {
        super();
    }
    static get signature() {
        return `Task:Manger`;
    }
    static get description() {
        return '调度任务中心，只能启动一次';
    }
    async handle(arg, options) {
        this.log('主任务启动');
        this.log('关闭其他taskManger进程');
        await this.claoseOtherTaskManger();
        this.log('其他TaskManager进程已关闭');
        this.log('避免当前还有正在运行的save2Log命令, 等待30s');
        this.log('开始休眠');
        for (let i = 0; i < 30; i++) {
            await utils_1.sleep(1 * 1000);
            this.log(`休眠中, 第${i + 1}秒`);
        }
        this.log('休眠完毕');
        this.log('开始注册cron任务');
        this.log('注册每分钟执行一次的任务');
        this.registerTaskRepeatPer1Minute();
        this.log('注册每10分钟执行一次的任务');
        this.registerTaskRepeatPer10Minute();
        this.log('注册每1小时执行一次的任务');
        this.registerTaskRepeatPer1Hour();
        this.log('全部定时任务注册完毕, 等待执行');
    }
    async claoseOtherTaskManger() {
        let taskManagerPidList = await this.getOtherTaskMangerPidList();
        this.log('当前process.pid => ', process.pid);
        this.log(`其余TaskManger进程Pid列表 => `, taskManagerPidList);
        this.log('执行kill操作, 关闭其余进程');
        for (let pid of taskManagerPidList) {
            this.log(`kill pid => ${pid}`);
            try {
                process.kill(pid);
            }
            catch (e) {
                let message = `TaskManger进程pid => ${pid} kill失败, 该pid不存在或者没有权限kill`;
                this.log(message);
            }
        }
    }
    async getOtherTaskMangerPidList() {
        let command = 'ps aS | grep Task:Manger | grep node | grep -v grep | grep -v \'"Task:Manger"\'';
        this.log(`检测命令=> ${command}`);
        let rawCommandOutput = shell.exec(command, {
            async: false,
            silent: true,
        });
        let rawCommandOutputList = rawCommandOutput.split('\n');
        let taskManagerPidList = [];
        for (let rawCommandOutput of rawCommandOutputList) {
            let commandOutput = _.trim(rawCommandOutput);
            commandOutput = _.replace(commandOutput, '\t', ' ');
            let pid = commandOutput.split(' ')[0];
            pid = parseInt(pid);
            if (_.isNumber(pid) && pid > 0) {
                if (pid !== process.pid) {
                    taskManagerPidList.push(pid);
                }
            }
        }
        return taskManagerPidList;
    }
    registerTaskRepeatPer1Minute() {
        let that = this;
        schedule.scheduleJob('0 */1 * * * * ', () => {
            that.log('registerTaskRepeatPer1Minute 开始执行');
            let nowByMinute = moment().format(config_1.COMMAND_ARGUMENT_BY_MINUTE);
            let twoMinuteAgoByMinute = moment()
                .subtract(2, 'minute')
                .format(config_1.COMMAND_ARGUMENT_BY_MINUTE);
            let threeMinuteAgoByMinute = moment()
                .subtract(3, 'minute')
                .format(config_1.COMMAND_ARGUMENT_BY_MINUTE);
            let fourMinuteAgoByMinute = moment()
                .subtract(4, 'minute')
                .format(config_1.COMMAND_ARGUMENT_BY_MINUTE);
            let fiveMinuteAgoByMinute = moment()
                .subtract(5, 'minute')
                .format(config_1.COMMAND_ARGUMENT_BY_MINUTE);
            let tenMinuteAgoByMinute = moment()
                .subtract(10, 'minute')
                .format(config_1.COMMAND_ARGUMENT_BY_MINUTE);
            that.log(`[按分钟] 每分钟启动一次SaveLog `);
            that.execCommand('SaveLog:Nginx', []);
            that.log(`[按分钟] 每分钟启动一次Watch:Alarm, 监控平台运行情况 `);
            that.log('registerTaskRepeatPer_1_Minute 命令分配完毕');
        });
    }
    registerTaskRepeatPer10Minute() {
        let that = this;
        schedule.scheduleJob('15 */10 * * * * *', function () {
            that.log('registerTaskRepeatPer10Minute 开始执行');
            let nowByHour = moment().format(config_1.COMMAND_ARGUMENT_BY_HOUR);
            let nowByMinute = moment().format(config_1.COMMAND_ARGUMENT_BY_MINUTE);
            let oneHourAgoByHour = moment()
                .subtract(1, 'hours')
                .format(config_1.COMMAND_ARGUMENT_BY_HOUR);
            let fifteenMinuteAgoByminute = moment()
                .subtract(15, 'minute')
                .format(config_1.COMMAND_ARGUMENT_BY_MINUTE);
            let intervalCommandList = ['CreateCache:UpdatePerOneMinute'];
            for (let intervalCommand of intervalCommandList) {
            }
            let parseCommandList = [
                'Parse:UV',
                'Parse:TimeOnSiteByHour',
            ];
            for (let parseCommand of parseCommandList) {
                that.dispatchParseCommand(parseCommand, fifteenMinuteAgoByminute, nowByMinute);
            }
            let summaryCommandList = [
                'Summary:UV',
                'Summary:NewUser',
                'Summary:Performance',
                'Summary:Error',
            ];
            that.log('registerTaskRepeatPer_10_Minute 命令分配完毕');
        });
    }
    async registerTaskRepeatPer1Hour() {
        let that = this;
        schedule.scheduleJob('30 15 * * * * *', function () {
            that.log('registerTaskRepeatPer1Hour 开始执行');
            let nowByDay = moment().format(config_1.COMMAND_ARGUMENT_BY_DAY);
            let nowByMinute = moment().format(config_1.COMMAND_ARGUMENT_BY_MINUTE);
            let lastDayStartAtByMinute = moment()
                .subtract(1, 'day')
                .startOf('day')
                .format(config_1.COMMAND_ARGUMENT_BY_MINUTE);
            let parseCommandList = [
                'Parse:Device',
                'Parse:MenuClick',
                'Parse:UserFirstLoginAt',
            ];
            for (let parseCommand of parseCommandList) {
                that.dispatchParseCommand(parseCommand, lastDayStartAtByMinute, nowByMinute);
            }
            let summaryCommandList = [];
            for (let summaryCommand of summaryCommandList) {
                that.dispatchParseCommand(summaryCommand, nowByDay, config_1.UNIT.DAY);
            }
            that.log('registerTaskRepeatPer1Hour 命令分配完毕');
        });
    }
    execCommand(commandName, args = []) {
        let argvString = args
            .map(arg => {
            return `'${arg}'`;
        })
            .join('   ');
        let commandOrder = `NODE_ENV=${this.config.getEnv()} node ${config_1.appConfig.appPath}/dist/index.js ${commandName} ${argvString}`;
        this.log(`待执行命令=> ${commandOrder}`);
        let commandStartAtFormated = moment().format(config_1.DISPLAY_BY_MILLSECOND);
        let commandStartAtms = moment().valueOf();
        shell.exec(commandOrder, {
            async: true,
            silent: false,
        }, () => {
            let commandFinishAtFormated = moment().format(config_1.DISPLAY_BY_MILLSECOND);
            let commandFinishAtms = moment().valueOf();
            let during = (commandFinishAtms - commandStartAtms) / 1000;
            this.log(`命令执行完毕 => ${commandOrder}, 共用时${during}秒, 开始执行时间=> ${commandStartAtFormated}, 执行完毕时间=> ${commandFinishAtFormated}`);
            this.log(`========         分隔符          ==========`);
        });
    }
    async dispatchParseCommand(commandName, startAtStr, endAtStr) {
        this.log(`${commandName}任务开始, 处理时间 => ${startAtStr}, ${endAtStr}`);
        this.execCommand(commandName, [
            startAtStr,
            endAtStr,
        ]);
    }
}
exports.default = TaskManger;
