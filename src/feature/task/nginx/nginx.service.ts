import * as fs from 'fs';
import * as md5 from 'md5';
import * as _ from 'lodash';
import * as path from 'path';
import * as moment from 'moment';
import * as queryString from 'query-string';
import * as shell from 'shelljs';
import * as parser from 'ua-parser-js';
import { TRProject } from '@entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import appConfig from '../../../../config/app';
import { readLine, writeLine } from 'lei-stream';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '../../../core/configure/config.service';
import {
  ip2Locate,
  LOG_TYPE_RAW,
  LOG_TYPE_JSON,
  LOG_TYPE_TEST,
  getAbsoluteLogUriByType, //  生成对应日志绝对路径, 按分钟分隔
} from '../../../utils';
let jsonWriteStreamPool = new Map();
let rawLogWriteStreamPool = new Map();
/**
 *  nginx 存储日志
 */
@Injectable()
export class NginxService {
  constructor(
    @InjectRepository(TRProject)
    private readonly projectRepository: Repository<TRProject>,
  ) {}

  private readonly logger = new Logger(NginxService.name);
  public projectMap = {};
  public logCounter = 0;
  public legalLogCounter = 0;
  registerTaskRepeatPer1Minute() {
    this.logger.log('registerTaskRepeatPer1Minute 开始执行');
    // let nowByMinute = moment().format(COMMAND_ARGUMENT_BY_MINUTE);
    // let twoMinuteAgoByMinute = moment()
    //   .subtract(2, 'minute')
    //   .format(COMMAND_ARGUMENT_BY_MINUTE);
    // let threeMinuteAgoByMinute = moment()
    //   .subtract(3, 'minute')
    //   .format(COMMAND_ARGUMENT_BY_MINUTE);
    // let fourMinuteAgoByMinute = moment()
    //   .subtract(4, 'minute')
    //   .format(COMMAND_ARGUMENT_BY_MINUTE);
    // let fiveMinuteAgoByMinute = moment()
    //   .subtract(5, 'minute')
    //   .format(COMMAND_ARGUMENT_BY_MINUTE);
    // let tenMinuteAgoByMinute = moment()
    //   .subtract(10, 'minute')
    //   .format(COMMAND_ARGUMENT_BY_MINUTE);
    this.logger.log(`[按分钟] 每分钟启动一次SaveLog `);
    // this.logger.execCommand('SaveLog:Nginx', []);
    this.logger.log(`[按分钟] 每分钟启动一次Watch:Alarm, 监控平台运行情况 `);
    // this.logger.execCommand('Watct:Alarm', []); //TODO:
    this.logger.log('registerTaskRepeatPer_1_Minute 命令分配完毕');
  }
  // nginx 读取日志文件
  @Cron('0 */1 * * * *')
  // @Cron('*/4 * * * * *')
  async nginxSaveLog() {
    // 获取项目列表
    this.projectMap = await this.getList();
    this.logCounter = 0;
    this.legalLogCounter = 0;
    let nginxLogFilePath = appConfig.absoluteLogPath + '/nginx';
    // 每间隔一分钟读取，前一分钟的数据
    let timeAt = moment().unix() - 120;
    let timeMoment = moment.unix(timeAt);
    let formatStr = timeMoment.format('/YYYYMM/DD/HH/mm');
    let logAbsolutePath: string = '';
    this.logger.log(`is devekopment ${ConfigService.isDevelopment}`);
    if (ConfigService.isDevelopment) {
      // 使用测试数据
      logAbsolutePath = `${nginxLogFilePath}${'test'}.log`;
    } else {
      logAbsolutePath = `${nginxLogFilePath}${formatStr}.log`;
    }
    if (fs.existsSync(logAbsolutePath) === false) {
      this.logger.log(`log文件不存在, 自动跳过 => ${logAbsolutePath}`);
      return false;
    }
    this.logger.log(`开始读取文件 => ${logAbsolutePath}`);

    (readLine(fs.createReadStream(logAbsolutePath), {
      // 换行符，默认\n
      newline: '\n',
      // 是否自动读取下一行，默认false
      autoNext: false,
      /** 是否将数据转换为字符串 */
      toString: true,
      // 编码器，可以为函数或字符串（内置编码器：json，base64），默认null
      encoding: null,
    }) as any).go(this.onDataIn, function() {
      // return true;
    });
  }

  onDataIn = async (data, next) => {
    this.logCounter++;
    let content = data.toString();
    // 获取日志时间, 没有原始日志时间则直接跳过
    let logCreateAt = this.parseLogCreateAt(content);
    if (_.isFinite(logCreateAt) === false || logCreateAt <= 0) {
      this.logger.log('日志时间不合法, 自动跳过');
      return;
    }
    // 检查日志格式, 只录入解析后, 符合规则的log
    let parseResult = await this.parseLog(content, this.projectMap);
    if (_.isEmpty(parseResult)) {
      this.logger.log('日志格式不规范, 自动跳过, 原日志内容为 =>', content);
      return false;
    }

    let projectName = _.get(parseResult, ['project_name'], 0);
    let projectRate = _.get(this.projectMap, [projectName, 'rate'], 100);
    let checkFlag = _.floor(this.logCounter % 10000);
    let skipIt = checkFlag > projectRate;

    this.legalLogCounter = this.legalLogCounter + 1;

    // 存原始数据
    let rawLogWriteStreamByLogCreateAt = this.getWriteStreamClientByType(
      logCreateAt,
      LOG_TYPE_RAW,
    );
    rawLogWriteStreamByLogCreateAt.write(content);
    this.logger.log(
      `收到数据, 当前共记录${this.legalLogCounter}/${this.logCounter}条数据`,
    );
    let jsonWriteStreamByLogCreateAt = this.getWriteStreamClientByType(
      logCreateAt,
      LOG_TYPE_JSON,
    );
    jsonWriteStreamByLogCreateAt.write(JSON.stringify(parseResult));
    // 定期清一下
    if (jsonWriteStreamPool.size > 2 || rawLogWriteStreamPool.size > 2) {
      // 每当句柄池满100后, 关闭除距离当前时间10分钟之内的所有文件流
      this.autoCloseOldStream();
    }
    next();
  };
  /**
   * 解析日志记录所在的时间戳, 取日志时间作为时间戳, 若日志时间不规范, 则返回0
   * 客户端时间不可信, 故直接忽略, 以日志时间为准
   * @param {String} data
   * @return {Number}
   */
  parseLogCreateAt(data) {
    let nowAt = moment().unix();
    if (_.isString(data) === false) {
      return nowAt;
    }
    const info = data.split(' ');
    let url = _.get(info, [5], '');
    const urlQS = queryString.parseUrl(url);
    let record = _.get(urlQS, ['query', 'd'], '[]');
    try {
      record = JSON.parse(record);
    } catch (err) {
      return nowAt;
    }
    if (_.has(record, ['pub'])) {
      // common是新sdk的字段值, pub是旧值, 这里做下兼容
      record.common = record.pub;
    }
    // matc
    let logAtMoment = moment(
      info[3].match(/(?!\[).*(?<!])/)[0],
      moment.ISO_8601,
    );
    let logAt = 0;
    if (moment.isMoment(logAtMoment) && logAtMoment.isValid()) {
      logAt = logAtMoment.unix();
    } else {
      this.logger.log(`无法解析日志记录时间 => ${info[0]}, 自动跳过`);
    }
    return logAt;
  }
  /***
   * 将日志解析为标准格式, 解析失败返回null
   * @param {string} data
   * @param {object} projectMap code => project_id格式的项目字典
   * @returns {object|null}
   */
  async parseLog(data, projectMap) {
    const info = data.split(' ');
    let url = _.get(info, [5], '');
    const urlQS = queryString.parseUrl(url);
    let record = _.get(urlQS, ['query', 'd'], '[]');
    try {
      record = JSON.parse(record);
    } catch (err) {
      this.logger.log('==== 打点数据异常 ====', err);
      return null;
    }
    // 记录日志md5
    record.md5 = md5(data);
    if (_.has(record, ['pub'])) {
      // common是新sdk的字段值, pub是旧值, 这里做下兼容
      record.common = record.pub;
    }
    //  过滤不合法的打点数据
    //  记录为空, 没有pid, pid没有注册过, 都是非法数据
    if (_.isEmpty(record)) {
      this.logger.log('record 不规范 =>', record);
      return null;
    }
    //TODO: 校验项目id
    if (_.has(record, ['key']) === false) {
      this.logger.log('key 不存在 =>', record);
      return null;
    }
    if (record.key === '') {
      this.logger.log('记录中没有record.key  =>', record.key);
      return null;
    }
    if (_.has(projectMap, [record.project_id]) === false) {
      this.logger.log(`项目尚未注册projectMap=>[${record.project_id}]`);
      return null;
    }

    // record.project_name = record.common.pid;
    let currentAt = moment().unix();
    let logCreateAt = this.parseLogCreateAt(data);
    // 如果入库时间距离现在大于10天, 则认为是不合法数据(nginx中只会存7天以内的数据, 入库时间超出上下10天, 都不正常)
    if (Math.abs(logCreateAt - currentAt) > 864000) {
      this.logger.log(
        '入库时间超出阈值, 自动跳过 finialTimeAt=>' + logCreateAt,
      );
      return null;
    }
    record.time = logCreateAt;

    // 新版中info[17] 里有%号, 是非法字符, 需要提前处理
    let safeInfo17 = _.replace(info[17], '%', '');
    record.ua = parser(decodeURIComponent(safeInfo17));

    // 兼容处理saas系统打点UA问题, nwjs低版本下获取不到chrome的版本, 解析拿到的为chromium_ver
    let browserVersion = _.get(record.ua, ['browser', 'version'], '');
    if (browserVersion === 'chromium_ver') {
      _.set(record.ua, ['browser', 'version'], '50.0.2661.102');
      _.set(record.ua, ['browser', 'major'], '50');
    }

    // 解析IP地址，映射成城市
    record.ip = info[0] || info[1];
    const location = await ip2Locate(record.ip);
    record.country = location.country;
    record.province = location.province;
    record.city = location.city;
    return record;
  }
  /**
   * 根据不同类型——获取数据并写入Stream
   * @param {number} nowAt
   * @returns {WriteStream}
   */
  getWriteStreamClientByType(nowAt, logType = LOG_TYPE_RAW) {
    // 确保logType一定是指定类型
    switch (logType) {
      case LOG_TYPE_RAW:
        break;
      case LOG_TYPE_JSON:
        break;
      case LOG_TYPE_TEST:
        break;
      default:
        logType = LOG_TYPE_RAW;
    }
    let nowAtLogUri = getAbsoluteLogUriByType(nowAt, logType);
    // 创建对应路径
    let logPath = path.dirname(nowAtLogUri);
    this.logger.log('创建存储目录 =>' + logPath);
    shell.mkdir('-p', logPath);
    let nowAtWriteStream = null;
    if (jsonWriteStreamPool.has(nowAtLogUri)) {
      nowAtWriteStream = jsonWriteStreamPool.get(nowAtLogUri);
    } else {
      nowAtWriteStream = writeLine(
        fs.createWriteStream(nowAtLogUri, { flags: 'a' }),
        {
          // 换行符，默认\n
          newline: '\n',
          encoding: null,
          cacheLines: 0, // 直接落磁盘
        },
      );
      jsonWriteStreamPool.set(nowAtLogUri, nowAtWriteStream);
    }
    return nowAtWriteStream;
  }

  /**
   * 自动关闭旧Stream
   */
  autoCloseOldStream(isCloseAll = false) {
    let nowAt = moment().unix();
    let startAt = nowAt - 60 * 100;
    let finishAt = nowAt - 60 * 100;
    let survivalSet = new Set();
    for (
      let survivalAt = startAt;
      survivalAt < finishAt;
      survivalAt = survivalAt + 1
    ) {
      let survivalAtLogUri = getAbsoluteLogUriByType(nowAt, LOG_TYPE_JSON);
      let survivalAtRawLogUri = getAbsoluteLogUriByType(nowAt, LOG_TYPE_RAW);
      if (isCloseAll === false) {
        survivalSet.add(survivalAtLogUri);
        survivalSet.add(survivalAtRawLogUri);
      }
    }

    let needCloseLogUriSet = new Set();
    // 获得所有过期uri key
    for (let testLogFileUri of jsonWriteStreamPool.keys()) {
      if (survivalSet.has(testLogFileUri) === false) {
        needCloseLogUriSet.add(testLogFileUri);
      }
    }
    // 依次关闭
    for (let closeLogUri of needCloseLogUriSet) {
      let needCloseStream = jsonWriteStreamPool.get(closeLogUri);
      jsonWriteStreamPool.delete(closeLogUri);
      needCloseStream.end();
    }

    // 重复一次
    needCloseLogUriSet.clear();
    for (let testLogFileUri of rawLogWriteStreamPool.keys()) {
      if (survivalSet.has(testLogFileUri) === false) {
        needCloseLogUriSet.add(testLogFileUri);
      }
    }
    for (let closeLogUri of needCloseLogUriSet) {
      let needCloseStream = rawLogWriteStreamPool.get(closeLogUri);
      rawLogWriteStreamPool.delete(closeLogUri);
      needCloseStream.end();
    }

    return true;
  }
  /**
   * 项目列表
   */
  async getList() {
    let projectList = await this.projectRepository
      .createQueryBuilder()
      .where({ is_delete: 0 })
      .getMany();
    let projectMap = {};
    for (let project of projectList) {
      projectMap[project.projectName] = {
        id: project.id,
        rate: project.rate,
      };
    }
    this.logger.log(`项目列表获取成功 => ${JSON.stringify(projectMap)}`);
    return projectMap;
  }
}
