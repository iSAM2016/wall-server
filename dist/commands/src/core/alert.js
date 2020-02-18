"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5 = require("md5");
const coreBase_1 = require("./coreBase");
const utils_1 = require("../utils");
class Alert extends coreBase_1.default {
    constructor() {
        super();
        this.ucidList = [];
        this.sendList = [];
    }
    sendMessage(rawUcidListString = '', message = '') {
        if (this.config.get('ALERT_IS_USEING')) {
            this.sendWXMessage(rawUcidListString.split(','), message);
        }
        else {
            return false;
        }
    }
    sendWXMessage(rawUcidList = [], message = '') {
        this.checkUcidList(rawUcidList);
        this.formatMessage(message);
        this.sendList.forEach(content => {
        });
        return true;
    }
    checkUcidList(rawUcidList) {
        this.ucidList.length = 0;
        rawUcidList.forEach(rawUcid => {
            let ucid = rawUcid;
            if (ucid.length > 10) {
                ucid = parseInt(ucid.substr(1));
            }
            this.ucidList.push(ucid);
        });
    }
    formatMessage(message) {
        this.sendList.length = 0;
        let localIpStr = this.getLocalIpStr();
        let messageId = this.getMessageId(message);
        let ALERT_MAX_CONTENT_CHAR = Number(this.config.get('ALERT_MAX_CONTENT_CHAR'));
        if (message.length > ALERT_MAX_CONTENT_CHAR) {
            let totalCount = parseInt(String(message.length / ALERT_MAX_CONTENT_CHAR)) + 1;
            let lastIndex = 1;
            for (; lastIndex <= totalCount; lastIndex = lastIndex + 1) {
                let subContent = message.substring(ALERT_MAX_CONTENT_CHAR * (lastIndex - 1), ALERT_MAX_CONTENT_CHAR * lastIndex);
                let messageStr = `消息:${messageId}(${lastIndex}/${totalCount})来自机器(${localIpStr}):${subContent}`;
                this.sendList.push(messageStr);
            }
        }
        else {
            let messageStr = `消息:${messageId}来自机器(${localIpStr}):${message}`;
            this.sendList.push(messageStr);
        }
    }
    getLocalIpStr() {
        return utils_1.getLocalIpList().join(',');
    }
    getMessageId(message) {
        return md5(message).substring(0, 10);
    }
}
exports.Alert = Alert;
