#!/bin/bash
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
  hoursTime=`expr $hours - 1`
  if [[ $hoursTime -lt 10 ]];
  then
    hours=0$hoursTime
  else
    hours=$hoursTime
  fi
elif [ $hours -eq -1 ]; 
then
  hours=23
fi
pre_min=`expr $current_min - 1`
# echo $hours >  $base_path/access.log
log_path=nginx/$year_month/$day/$hours
# echo $base_path/$log_path/$pre_min.log
mkdir -p $base_path/$log_path
mv $base_path/access.log $base_path/$log_path/$pre_min.log
sleep 1
# # 发信号
kill -USR1 `cat /var/run/nginx.pid` 
