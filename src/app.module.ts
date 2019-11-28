import { Connection } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
// 系统配置
import { Photo } from './feature/photo/photo.entity';
import { ConfigModule } from '../config/config.module';
import { FeatureModule } from './feature/feature.module';
@Module({
  //导入此模块中所需的提供程序的模块列表。
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'abc123456',
      database: 'nest',
      entities: [Photo],
      synchronize: true,
    }),
    ConfigModule, // 配置模块（系统配置）
    FeatureModule, // FeatureModule 特性模块（业务模块，如用户模块，产品模块等）
  ],
  controllers: [AppController], //存放创建的一组控制器。
  providers: [
    // 由Nest注入器实例化的服务，可以在这个模块之间共享。
    AppService,
  ],
  exports: [], //导出这个模块可以其他模块享用providers里的服务。
})
export class AppModule {
  // constructor(private readonly connection: Connection) {}
}
// AppModule 根模块

// CoreModule 核心模块（注册中间件，过滤器，管道，守卫，拦截器，装饰器等）
// SharedModule 共享模块（注册服务，mongodb，redis等）

// 客户端请求 ---> 中间件 ---> 守卫 ---> 拦截器之前
// ---> 管道 ---> 控制器处理并响应 ---> 拦截器之后 ---> 过滤器
