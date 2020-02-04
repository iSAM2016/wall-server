#!/bin/bash
# 凌晨 00:00:01,把昨天的日志重命名,放在相应的目录下再 USR1 信息号控制 nginx 重新生成新的日志文件
base_path='/var/log/nginx'
year_month=$(date +"%Y%m")
day=$(date +"%d")
#0-24
hours=$(date +"%H")
# 不使用-d 因为兼容有问题
current_min=$(date +"%M")

if [[ $current_min -eq 0 ]];
then
  current_min=60
  hours=`expr $hours - 1`
elif [[ $hours -eq -1 ]]; 
then
  hours=23
fi
pre_min=`expr $current_min - 1`
log_path=nginx/$year_month/$day/$hours
# echo $base_path/$log_path/$pre_min.log
mkdir -p $base_path/$log_path
mv $base_path/access.log $base_path/$log_path/$pre_min.log
sleep 1
# # 发信号
kill -USR1 `cat /var/run/nginx.pid` 
