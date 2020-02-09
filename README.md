# wall-server

# wall-server

监控系统的后台管理

## 部署

- 设置`env` 环境

  - 请在 `env`目录下设置三个环境的变量
  - 测试 三个环境变量是否正确
    - `node setConfigEnv.js`
  - 根据使用环境不同，将 env 中要使用的变量复制到`.env`下

* 建表

  - 进入 `./commands`
    - `cd ./commands`
    - `npm i`
  - 例如我们要新建的两个项目的 ID 为 1,2
    - `node ./dist/index.js Utils:GenerateSQL 1,2 '2020-01' '2020-12' > ../int.sql`

* 启动`docker-compose`

  - 进入项目根目录下
  - 启动`docker-compose`
    - `docker-compose up`
  - 连接数据库，int.sql 入库

* 暂时没有后台管理，我们在`t_r_project`，中插入一个项目，

  - 第一条 `id:1, project_name:NtsGbhvxzDSm1ti2uffSue7u2UIFPVXo`, 其他数据任意

* 设置为`sdk`
  进入`wall-sdk`,
  - `npm i`
  - `npm start`
  - 调整`index.html 的注释进行测试`

## 开发

# docker-compose 常用命令

docker-compose up [options][service...]

`docker-compose up -d mysql`
该命令十分强大，它将尝试自动完成包括构建镜像，（重新）创建服务，启动服务，并关联服务相关容器的一系列操作。
链接的服务都将会被自动启动，除非已经处于运行状态。

docker-compose down
此命令将会停止 up 命令所启动的容器，并移除网络

docker-compose restart [options][service...]

- 以后台方式启动运行
  docker-compose up -d

- 查看启动的服务容器
  docker-compose ps

* 停止所有运行中的容器
  docker-compose down
