import * as md5 from 'md5';
import _ from 'lodash';
import CoreBase from './coreBase';
import { Inject } from 'typescript-ioc';
import { ConfigService } from '@app/core';
import { getLocalIpList, http } from '@app/utils';
export class Alert extends CoreBase {
  private ucidList = [];
  private sendList = [];
  constructor() {
    super();
  }

  sendMessage(rawUcidListString = '', message = '') {
    if (this.config.get('ALERT_IS_USEING')) {
      this.sendWXMessage(rawUcidListString.split(','), message);
    } else {
      return false;
    }
  }
  /**
   * 发送消息
   * @param rawUcidList
   * @param message
   */
  private sendWXMessage(
    rawUcidList: Array<string> = [],
    message: string = '',
  ): boolean {
    // 适配ucid为15位的情况
    this.checkUcidList(rawUcidList);
    this.formatMessage(message);
    this.sendList.forEach(content => {
      // TODO: 需要promise
      // http.post(
      //   String(this.config.get('ALERT_WXADDR')),
      //   JSON.stringify({
      //     app: 'wx', // via 平台fe
      //     content: content, // 报警内容
      //     user: this.ucidList.join('|'), // | 分隔
      //   }),
      // );
    });
    return true;
  }
  /**
   * 整理ucid
   */
  private checkUcidList(rawUcidList) {
    this.ucidList.length = 0;
    rawUcidList.forEach(rawUcid => {
      let ucid = rawUcid;
      if (ucid.length > 10) {
        // 对于完整式ucid, 去掉前边的标志位后, 转成数字即为真实ucid
        ucid = parseInt(ucid.substr(1));
      }
      this.ucidList.push(ucid);
      //   this.ucidList = _.uniq(this.ucidList);TODO: errror
    });
  }
  // 格式化消息
  private formatMessage(message) {
    this.sendList.length = 0;
    let localIpStr = this.getLocalIpStr();
    let messageId = this.getMessageId(message);
    let ALERT_MAX_CONTENT_CHAR = Number(
      this.config.get('ALERT_MAX_CONTENT_CHAR'),
    );
    // 如果message太长, 就分批发送
    if (message.length > ALERT_MAX_CONTENT_CHAR) {
      let totalCount =
        parseInt(String(message.length / ALERT_MAX_CONTENT_CHAR)) + 1;
      let lastIndex = 1;

      for (; lastIndex <= totalCount; lastIndex = lastIndex + 1) {
        let subContent = message.substring(
          ALERT_MAX_CONTENT_CHAR * (lastIndex - 1),
          ALERT_MAX_CONTENT_CHAR * lastIndex,
        );

        let messageStr = `消息:${messageId}(${lastIndex}/${totalCount})来自机器(${localIpStr}):${subContent}`;
        this.sendList.push(messageStr);
      }
    } else {
      let messageStr = `消息:${messageId}来自机器(${localIpStr}):${message}`;
      this.sendList.push(messageStr);
    }
  }

  private getLocalIpStr(): string {
    return getLocalIpList().join(',');
  }

  private getMessageId(message) {
    return md5(message).substring(0, 10);
  }
}
