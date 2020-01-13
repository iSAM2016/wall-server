export * from './network';

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
