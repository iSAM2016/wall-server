#基于centos7.2镜像构建
FROM centos:centos7.2.1511
#工作目录，相当于cd到一个目录
WORKDIR /home

ENV TZ=Asia/Shanghai
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

COPY ./sh/Shanghai .

COPY ./sh/nginxstart.sh .

COPY ./sh/splitLog.sh .

COPY ./sh/davecron .

RUN cat ./Shanghai > /etc/localtime


#打开80端口
EXPOSE 80

#启动容器
CMD ["/home/nginxstart.sh"]
