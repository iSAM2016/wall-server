import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';
import { FeatureModule } from './feature/feature.module';
@Module({
  //导入此模块中所需的提供程序的模块列表。
  // SharedModule 共享模块（注册服务，mongodb，redis等）模块不需要引入 shared 模块，shared 模式给业务模块引用的，
  imports: [
    CoreModule, // 核心模块（系统配置,注册中间件，过滤器，管道，守卫，拦截器，装饰器等）
    FeatureModule, // FeatureModule 特性模块（业务模块，如用户模块，产品模块等）
  ],
  controllers: [AppController], //存放创建的一组控制器。
  providers: [
    // 由Nest注入器实例化的服务，可以在这个模块之间共享。
    AppService,
  ],
  exports: [], //导出这个模块可以其他模块享用providers里的服务。
})
export class AppModule {}

// 客户端请求 ---> 中间件 ---> 守卫 ---> 拦截器之前
// ---> 管道 ---> 控制器处理并响应 ---> 拦截器之后 ---> 过滤器
