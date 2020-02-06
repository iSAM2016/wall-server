# wall-server

1. docker-compose 常用命令

   docker-compose up [options][service...]

   `docker-compose up -d mysql`
   该命令十分强大，它将尝试自动完成包括构建镜像，（重新）创建服务，启动服务，并关联服务相关容器的一系列操作。
   链接的服务都将会被自动启动，除非已经处于运行状态。

docker-compose down
此命令将会停止 up 命令所启动的容器，并移除网络

docker-compose restart [options][service...]
