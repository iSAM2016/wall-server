#基于centos7.2镜像构建
#docker  build  -t isam2016/nginx:1.0.0 .
FROM centos:centos7.2.1511
#工作目录，相当于cd到一个目录
WORKDIR /usr/src

#可以去执行一些命令
RUN yum install wget -y && \
    wget http://mirrors.aliyun.com/repo/Centos-7.repo -O /etc/yum.repos.d/centos.repo && \
    yum install --nogpgcheck gcc make pcre-devel zlib-devel wget -y  &&  \
    wget http://nginx.org/download/nginx-1.16.0.tar.gz && \
    tar xf nginx-1.16.0.tar.gz && \
    rm -rf nginx-1.16.0.tar.gz && \
    cd nginx-1.16.0 && \
    ./configure --prefix=/usr/local/nginx --with-pcre  && \
    make && make install && \
    echo "daemon off;" >> /usr/local/nginx/conf/nginx.conf && \
    yum install -y crontabs\
    yum clean all


#打开80端口
EXPOSE 80
#启动容器

CMD ["/usr/local/nginx/sbin/nginx", ""]
# FROM node:10.13-alpine
# ENV NODE_ENV production
# WORKDIR /usr/src/app
# COPY ["package.json", "./"]
# RUN npm install --production --silent 
# COPY . .
# EXPOSE 3000
# CMD npm start