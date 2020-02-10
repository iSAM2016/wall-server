"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const ace = require("@adonisjs/ace");
const core_1 = require("./core");
const config_1 = require("./config");
const registedCommandList = [
    './demo',
    './feature/parse/uv',
    './feature/parse/time_on_site',
    './feature/parse/device',
    './feature/parse/menu_click',
    './feature/parse/user_first_login_at',
    './feature/save_log/parseNginxLog',
    './feature/watch',
    './feature/task/manage',
    './feature/sql',
];
for (let command of registedCommandList) {
    ace.addCommand(require(command)['default']);
}
ace.onError(function (error, commandName) {
    let alert = new core_1.Alert();
    let logger = new core_1.Logger({});
    console.log('=========================');
    alert.sendMessage(String(this.config.get('ALERT_WATCH_UCID_LIST')), error.message);
    let triggerAt = moment().format(config_1.DISPLAY_BY_MILLSECOND);
    console.log(`[${triggerAt}]-[${this.constructor.name}] ` + error.message);
    logger.getLogger4Command(this.constructor.name).info(error.message);
    process.exit(1);
});
ace.wireUpWithCommander();
ace.invoke();
