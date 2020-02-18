"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const commandsBase_1 = require("../commandsBase");
const utils_1 = require("../../utils");
const typescript_ioc_1 = require("typescript-ioc");
const watch_service_1 = require("./watch.service");
const core_1 = require("../../core");
const BASE_REDIS_KEY = 'plat_fe_fee_watch_alarm_';
const MAX_QUERY_COUNT = 10;
const MAX_SLEEP_COUNT = 60;
function getRedisKey(id) {
    return BASE_REDIS_KEY + id;
}
class WatchAlarm extends commandsBase_1.default {
    constructor() {
        super();
        this.currentQueryCounter = 0;
    }
    static get signature() {
        return `
        WatchDog:Alarm
    `;
    }
    static get description() {
        return '[根据报警配置] 监测每一条报警配置对应的项目错误';
    }
    async handle(args, options) {
        try {
            const alarmConfigList = await this.watchService.getAllEnabled();
            for (let alarmConfig of alarmConfigList) {
                const { id, project_id: projectId, error_name: errorName, time_range_s: timeRange, max_error_count: maxErrorCount, alarm_interval_s: alarmInterval, note, } = alarmConfig;
                const redisKey = getRedisKey(id);
                const hasAlertInAlarmInterval = await this.redisClient.asyncGet(redisKey);
                if (hasAlertInAlarmInterval) {
                    this.log(`项目${projectId}监听的${errorName}错误在${timeRange}秒内报警过，自动跳过`);
                }
                else {
                    let waitForDispatch = true;
                    let sleepCounter = 0;
                    while (waitForDispatch) {
                        if (this.currentQueryCounter < MAX_QUERY_COUNT) {
                            this.autoAlarm(projectId, errorName, timeRange, maxErrorCount, alarmInterval, redisKey, note, id)
                                .then(() => {
                                this.currentQueryCounter = this.currentQueryCounter - 1;
                            })
                                .catch(() => {
                                this.currentQueryCounter = this.currentQueryCounter - 1;
                            });
                            this.currentQueryCounter = this.currentQueryCounter + 1;
                            waitForDispatch = false;
                        }
                        else {
                            sleepCounter = sleepCounter + 1;
                            if (sleepCounter > MAX_SLEEP_COUNT) {
                                const sleepMinutes = sleepCounter / 60;
                                await this.alert.sendMessage(`报警系统数据库查询已经睡眠${sleepMinutes}分钟，可能出问题了。`);
                            }
                            await utils_1.sleep(1000);
                        }
                    }
                }
            }
        }
        catch (error) { }
    }
    async autoAlarm(projectId, errorName, timeRange, maxErrorCount, alarmInterval, redisKey, note, configId) {
        const nowAt = moment().unix();
        const timeAgoAt = nowAt - timeRange;
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", watch_service_1.WatchService)
], WatchAlarm.prototype, "watchService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", core_1.RedisClient)
], WatchAlarm.prototype, "redisClient", void 0);
exports.default = WatchAlarm;
