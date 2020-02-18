"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./nginx"));
__export(require("./annotation"));
const os = require("os");
const path = require("path");
const datx = require("ipip-datx");
const querystring = require("query-string");
const _ = require("lodash");
const axios_1 = require("axios");
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
exports.getFlattenCityRecordListInDistribution = getFlattenCityRecordListInDistribution;
const getLocalIpList = () => {
    let networkInterfaceList = os.networkInterfaces();
    let localIpList = [];
    for (let networkInterface of Object.keys(networkInterfaceList)) {
        for (let interfaceInfo of networkInterfaceList[networkInterface]) {
            if (interfaceInfo.family !== 'IPv4' || interfaceInfo.internal !== false) {
                continue;
            }
            let ip = interfaceInfo.address;
            localIpList.push(ip);
        }
    }
    return localIpList;
};
exports.getLocalIpList = getLocalIpList;
exports.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let http = axios_1.default.create();
exports.http = http;
function postForm(url, formData = {}, config = {}) {
    return http.post(url, querystring.stringify(formData), Object.assign(Object.assign({}, config), { headers: Object.assign({ 'Content-Type': 'application/x-www-form-urlencoded' }, _.get(config, ['headers'], {})) }));
}
http.postForm = postForm;
let ipDatabaseUri = path.resolve(__dirname, '../../ip2locate_ipip.net_20180910.datx');
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
            country,
            province,
            city,
        };
    }
    let res = await DatabaseClient.findSync(ip);
    country = _.get(res, [0], '');
    province = _.get(res, [1], '');
    city = _.get(res, [2], '');
    return {
        country,
        province,
        city,
    };
}
exports.ip2Locate = ip2Locate;
