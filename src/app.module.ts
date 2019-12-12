import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';
import { FeatureModule } from './feature/feature.module';
import { LoggerMiddleware } from './core/middleware/logger.middleware';

// import { ApplicationGateway } from './app.gateway';
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
  // exports: [ApplicationGateway], //导出这个模块可以其他模块享用providers里的服务。
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

// 客户端请求 ---> 中间件 ---> 守卫 ---> 拦截器之前 ---> 管道 ---> 控制器处理并响应 ---> 拦截器之后 ---> 过滤器

// 全局管道、守卫、过滤器和拦截器和任何模块松散耦合。他们不能依赖注入任何服务，因为他们不属于任何模块。
// 可以使用控制器作用域、方法作用域或辅助作用域仅由管道支持，
// 其他除了中间件是模块作用域，都是控制器作用域和方法作用域。

// 重点：在示例给出了它们的写法，注意全局管道、守卫、过滤器和拦截器，只能new，全局中间件是纯函数，全局管道、守卫、
// 过滤器和拦截器，中间件都不能依赖注入。中间件模块注册也不能用new，可以依赖注入。管道、守卫、过滤器和拦截器局部注册
// 可以使用new和类名，除了管道以为其他都可以依赖注入。拦截器和守卫可以写成高阶方法来传参，达到定制目的。
