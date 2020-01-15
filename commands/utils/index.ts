import * as os from 'os';
import * as querystring from 'query-string';
import _ from 'lodash';
import axios from 'axios'; // 引入axios组件

/**
 * 将城市分布数据拍平后, 作为一个列表返回回来, 方便集中处理
 * @param {*} distribution
 * @return {Array}
 */
export function getFlattenCityRecordListInDistribution(distribution) {
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
export const getLocalIpList = () => {
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
let http = axios.create();

/**
 * post form表单
 * @param {string} url
 * @param {object} formData
 * @param {object} config
 */
function postForm(url, formData = {}, config = {}) {
  return http.post(url, querystring.stringify(formData), {
    ...config,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ..._.get(config, ['headers'], {}),
    },
  });
}
(http as any).postForm = postForm;

export { http };
