'use strict';
/**
 * 统一获取http数据
 */
import axios from 'axios'; // 引入axios组件
import * as querystring from 'query-string';
import _ from 'lodash';

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

export default http;
