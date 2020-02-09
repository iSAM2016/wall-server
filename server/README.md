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
