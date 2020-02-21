#!/bin/bash
export NODE_ENV=development

export SYSTEM_SECRET=cat
export NODE_VERSION=11.13
export APP_PORT=3000

export MYSQL_PORT=3307
export MYSQL_VERSION=5.7
export MYSQL_USER=root
export MYSQL_DATABASE=nest
export MYSQL_SYNCHRONIZE=true
export MYSQL_PASSWORD=abc123456
export MYSQL_ROOT_PASSWORD=abc123456
export MYSQL_DB_HOST=127.0.0.1

export REDIS_HOST=127.0.0.1
export REDIS_PORT=6379
export REDIS_DB=4

export MAIL_HOST=128.0.01
export MAIL_PORT=8989
export MAIL_USER=root
export MAIL_PASS=9
 
#24 * 3600 * 1000 毫秒
export MAXAGE_MS=86400000

#  alarm 
#  通知的对象
export ALERT_WATCH_UCID_LIST=123456000000000000
# 内容长度
export ALERT_MAX_CONTENT_CHAR=1500
#  警告系统是否启用 true  启用
export ALERT_IS_USEING=true
export ALERT_WXADDR=https://oapi.dingtalk.com/robot/send?access_token=1eba276aa954be35807b71e52a65828b3a969193ee38a0f7dbc32cfd1511b550



