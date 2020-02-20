export * from './nginx';
export * from './dataFormat';
export * from './database';
import * as os from 'os';
import axios from 'axios'; // 引入axios组件
import * as _ from 'lodash';
import * as path from 'path';
import * as datx from 'ipip-datx';
import * as querystring from 'query-string';
/**
 * 将城市分布数据拍平后, 作为一个列表返回回来, 方便集中处理
 * @param {*} distribution
 * @return {Array}
 */
function getFlattenCityRecordListInDistribution(distribution) {
  let recordList = [];
  for (let country of Object.keys(distribution)) {
    let countryDistribution = distribution[country];
    for (let province of Object.keys(countryDistribution)) {
      let provinceDistribution = countryDistribution[province];
      for (let city of Object.keys(provinceDistribution)) {
        let cityRecord = provinceDistribution[city];
        recordList.push(cityRecord);
      }
    }
  }
  return recordList;
}

/**
 * 获取本机ip
 */
const getLocalIpList = () => {
  // demo =>  {"lo":[{"address":"127.0.0.1","netmask":"255.0.0.0","family":"IPv4","mac":"00:00:00:00:00:00","internal":true,"cidr":"127.0.0.1/8"}],"eth0":[{"address":"10.26.27.20","netmask":"255.255.255.0","family":"IPv4","mac":"52:54:00:05:68:ba","internal":false,"cidr":"10.26.27.20/24"}]}
  let networkInterfaceList = os.networkInterfaces();
  let localIpList = [];
  for (let networkInterface of Object.keys(networkInterfaceList)) {
    for (let interfaceInfo of networkInterfaceList[networkInterface]) {
      if (interfaceInfo.family !== 'IPv4' || interfaceInfo.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        continue;
      }
      let ip = interfaceInfo.address;
      localIpList.push(ip);
    }
  }
  return localIpList;
};

/**
 * 延迟执行函数, 返回一个 Promise
 * @param {number} ms
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// 创建axios实例
// let http = axios.create();

/**
 * post form表单
 * @param {string} url
 * @param {object} formData
 * @param {object} config
 */
// function postForm(url, formData = {}, config = {}) {
//   return http.post(url, querystring.stringify(formData), {
//     ...config,
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       ..._.get(config, ['headers'], {}),
//     },
//   });
// }
// (http as any).postForm = postForm;

let ipDatabaseUri = path.resolve(
  __dirname,
  '../../../ip2locate_ipip.net_20180910.datx',
);

let DatabaseClient = new datx.City(ipDatabaseUri);

function isIp(ip) {
  return /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|$)){4}$/.test(ip);
}

async function ip2Locate(ip) {
  let country = '';
  let province = '';
  let city = '';
  if (isIp(ip) === false) {
    return {
      country, //  国家
      province, //  省
      city, //  市
    };
  }
  let res = await DatabaseClient.findSync(ip);
  country = _.get(res, [0], '');
  province = _.get(res, [1], '');
  city = _.get(res, [2], '');
  return {
    country, //  国家
    province, //  省
    city, //  市
  };
}

export {
  // http,
  ip2Locate,
  getLocalIpList,
  getFlattenCityRecordListInDistribution,
};
