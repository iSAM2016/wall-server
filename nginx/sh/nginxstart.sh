#!/bin/bash
 crond  restart &&  crontab davecron && cd /usr/local/nginx/sbin && ./nginx 